export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace all whitespace with -
    .replace(/[^a-z0-9-]/g, "") // Remove non-alphanumeric except -
    .replace(/--+/g, "-") // Remove repeated dashes
    .replace(/^-+|-+$/g, ""); // Trim dashes from start and end
}
