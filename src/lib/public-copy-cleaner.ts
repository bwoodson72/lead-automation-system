export function cleanPublicCopy(value: string): string {
  return value
    .replace(/\s*—\s*/g, ", ")
    .replace(/\bThe point is not\b/g, "This is not")
    .replace(/\bThe point is\b/g, "What matters is")
    .replace(/\bThe goal is not\b/g, "This is not")
    .replace(/\bThe goal is\b/g, "The aim is")
    .replace(/\bWhy this matters\b/g, "Practical consequence")
    .replace(/\bWhat that buys you:\s*/g, "")
    .replace(/\bThe better state is\b/g, "A better state is");
}

export function cleanPublicCopyTree<T>(value: T): T {
  if (typeof value === "string") return cleanPublicCopy(value) as T;
  if (Array.isArray(value)) return value.map((item) => cleanPublicCopyTree(item)) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([key, item]) => [key, cleanPublicCopyTree(item)])) as T;
  }
  return value;
}
