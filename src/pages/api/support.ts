import type { APIRoute } from "astro";
import { connect, type TLSSocket } from "node:tls";
import { siteConfig } from "@/config";

export const prerender = false;

const allowedCategories = new Set([
  "Product question",
  "Problem with product files",
  "Refund request",
  "Affiliate question",
  "Website problem",
  "Other",
]);

const maxRequestsPerWindow = 5;
const rateLimitWindowMs = 15 * 60 * 1000;
const rateLimits = new Map<string, { count: number; resetAt: number }>();

interface SupportPayload {
  name?: unknown;
  email?: unknown;
  category?: unknown;
  product?: unknown;
  purchaseEmail?: unknown;
  message?: unknown;
  website?: unknown;
}

interface SmtpResponse {
  code: number;
  lines: string[];
}

class SmtpSession {
  private buffer = "";
  private responses: SmtpResponse[] = [];
  private waiters: Array<(response: SmtpResponse) => void> = [];
  private errorWaiters: Array<(error: Error) => void> = [];

  constructor(private socket: TLSSocket) {
    socket.on("data", (chunk) => this.handleData(chunk.toString("utf8")));
    socket.on("error", (error) => this.fail(error));
  }

  private handleData(chunk: string) {
    this.buffer += chunk;

    while (true) {
      const lines = this.buffer.split("\r\n");
      let finalIndex = -1;

      for (let index = 0; index < lines.length; index += 1) {
        if (/^\d{3} /.test(lines[index] || "")) {
          finalIndex = index;
          break;
        }
      }

      if (finalIndex === -1) return;

      const responseLines = lines.slice(0, finalIndex + 1);
      this.buffer = lines.slice(finalIndex + 1).join("\r\n");
      const code = Number.parseInt(responseLines[finalIndex]?.slice(0, 3) || "0", 10);
      const response = { code, lines: responseLines };
      const waiter = this.waiters.shift();
      this.errorWaiters.shift();

      if (waiter) waiter(response);
      else this.responses.push(response);
    }
  }

  private fail(error: Error) {
    const rejecters = [...this.errorWaiters];
    this.errorWaiters = [];
    this.waiters = [];
    for (const reject of rejecters) reject(error);
  }

  read(timeoutMs = 12_000): Promise<SmtpResponse> {
    const queued = this.responses.shift();
    if (queued) return Promise.resolve(queued);

    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        const index = this.waiters.indexOf(onResponse);
        if (index >= 0) {
          this.waiters.splice(index, 1);
          this.errorWaiters.splice(index, 1);
        }
        reject(new Error("SMTP response timed out."));
      }, timeoutMs);

      const onResponse = (response: SmtpResponse) => {
        clearTimeout(timer);
        resolve(response);
      };

      const onError = (error: Error) => {
        clearTimeout(timer);
        reject(error);
      };

      this.waiters.push(onResponse);
      this.errorWaiters.push(onError);
    });
  }

  async command(command: string, expectedCodes: number[]) {
    this.socket.write(`${command}\r\n`);
    const response = await this.read();
    if (!expectedCodes.includes(response.code)) {
      throw new Error(`SMTP command failed with ${response.code}: ${response.lines.join(" ")}`);
    }
    return response;
  }
}

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

function text(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function isEmail(value: string) {
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function headerValue(value: string) {
  return value.replace(/[\r\n]+/g, " ").trim();
}

function getRequestIp(request: Request) {
  const forwarded = request.headers.get("x-vercel-forwarded-for") || request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "";
}

function isRateLimited(ip: string) {
  if (!ip) return false;

  const now = Date.now();
  const current = rateLimits.get(ip);

  if (!current || current.resetAt <= now) {
    rateLimits.set(ip, { count: 1, resetAt: now + rateLimitWindowMs });
    return false;
  }

  current.count += 1;
  rateLimits.set(ip, current);
  return current.count > maxRequestsPerWindow;
}

function waitForSecureConnect(socket: TLSSocket) {
  return new Promise<void>((resolve, reject) => {
    if (socket.authorized) {
      resolve();
      return;
    }

    const timer = setTimeout(() => reject(new Error("SMTP connection timed out.")), 12_000);
    socket.once("secureConnect", () => {
      clearTimeout(timer);
      resolve();
    });
    socket.once("error", (error) => {
      clearTimeout(timer);
      reject(error);
    });
  });
}

function buildEmail(options: {
  from: string;
  to: string;
  replyTo: string;
  replyName: string;
  subject: string;
  body: string;
}) {
  const normalizedBody = options.body.replace(/\r?\n/g, "\r\n").replace(/(^|\r\n)\./g, "$1..");
  const messageId = `<${crypto.randomUUID()}@developerbusinesslab.com>`;

  return [
    `From: Developer Business Lab Support <${headerValue(options.from)}>`,
    `To: ${headerValue(options.to)}`,
    `Reply-To: ${headerValue(options.replyName)} <${headerValue(options.replyTo)}>`,
    `Subject: ${headerValue(options.subject)}`,
    `Date: ${new Date().toUTCString()}`,
    `Message-ID: ${messageId}`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: 8bit",
    "",
    normalizedBody,
  ].join("\r\n");
}

async function sendViaGmail(options: {
  smtpUser: string;
  smtpPassword: string;
  to: string;
  replyTo: string;
  replyName: string;
  subject: string;
  body: string;
}) {
  const host = process.env.SUPPORT_SMTP_HOST || "smtp.gmail.com";
  const port = Number.parseInt(process.env.SUPPORT_SMTP_PORT || "465", 10);
  const socket = connect({ host, port, servername: host, rejectUnauthorized: true });
  const session = new SmtpSession(socket);

  try {
    await waitForSecureConnect(socket);
    const greeting = await session.read();
    if (greeting.code !== 220) throw new Error(`Unexpected SMTP greeting: ${greeting.code}`);

    await session.command("EHLO developerbusinesslab.com", [250]);

    const authToken = Buffer.from(`\0${options.smtpUser}\0${options.smtpPassword}`, "utf8").toString("base64");
    const authResponse = await session.command(`AUTH PLAIN ${authToken}`, [235, 334]);
    if (authResponse.code === 334) await session.command(authToken, [235]);

    await session.command(`MAIL FROM:<${options.smtpUser}>`, [250]);
    await session.command(`RCPT TO:<${options.to}>`, [250, 251]);
    await session.command("DATA", [354]);

    const email = buildEmail({
      from: options.smtpUser,
      to: options.to,
      replyTo: options.replyTo,
      replyName: options.replyName,
      subject: options.subject,
      body: options.body,
    });

    socket.write(`${email}\r\n.\r\n`);
    const delivered = await session.read();
    if (delivered.code !== 250) {
      throw new Error(`SMTP delivery failed with ${delivered.code}: ${delivered.lines.join(" ")}`);
    }

    await session.command("QUIT", [221]).catch(() => undefined);
  } finally {
    socket.end();
  }
}

export const POST: APIRoute = async ({ request }) => {
  if (isRateLimited(getRequestIp(request))) {
    return json({ ok: false, error: "Too many support requests. Please try again later." }, 429);
  }

  let payload: SupportPayload;
  try {
    payload = (await request.json()) as SupportPayload;
  } catch {
    return json({ ok: false, error: "Invalid support request." }, 400);
  }

  // Honeypot: browsers never ask a customer to fill this field.
  if (text(payload.website, 200)) {
    return json({ ok: true });
  }

  const name = text(payload.name, 100);
  const email = text(payload.email, 254).toLowerCase();
  const category = text(payload.category, 80);
  const product = text(payload.product, 160) || "Not product-specific";
  const purchaseEmail = text(payload.purchaseEmail, 254).toLowerCase();
  const message = text(payload.message, 5_000);

  if (name.length < 2 || !isEmail(email) || !allowedCategories.has(category) || message.length < 10) {
    return json({ ok: false, error: "Please complete the required support fields." }, 400);
  }

  if (purchaseEmail && !isEmail(purchaseEmail)) {
    return json({ ok: false, error: "Please enter a valid purchase email address." }, 400);
  }

  const smtpUser = process.env.SUPPORT_SMTP_USER?.trim();
  const smtpPassword = process.env.SUPPORT_SMTP_APP_PASSWORD?.replace(/\s+/g, "");
  const destination = process.env.SUPPORT_TO_EMAIL?.trim() || siteConfig.supportEmail;

  if (!smtpUser || !smtpPassword || !destination) {
    console.error("Support email is not configured. Missing SMTP environment variables.");
    return json({ ok: false, error: "Support email is temporarily unavailable. Please try again later." }, 503);
  }

  const subject = `[DBL Support] ${category}${product !== "Not product-specific" ? ` — ${product}` : ""}`;
  const body = [
    `Name: ${name}`,
    `Reply email: ${email}`,
    `Category: ${category}`,
    `Product: ${product}`,
    `Purchase email: ${purchaseEmail || "Same as reply email / not applicable"}`,
    "",
    "Details:",
    message,
  ].join("\n");

  try {
    await sendViaGmail({
      smtpUser,
      smtpPassword,
      to: destination,
      replyTo: email,
      replyName: name,
      subject,
      body,
    });

    return json({ ok: true });
  } catch (error) {
    console.error("Support email delivery failed.", error);
    return json({ ok: false, error: "We could not send your support request. Please try again shortly." }, 502);
  }
};
