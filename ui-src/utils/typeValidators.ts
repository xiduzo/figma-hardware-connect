export function toBoolean(input: unknown) {
  if (typeof input === "boolean") return input;

  if (typeof input === "string") {
    if (["true", "yes", "1"].includes(input)) return true;
    return false;
  }

  return !!input;
}
