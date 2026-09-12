/** Join class names, dropping falsy values. The whole of `clsx` in 4 lines. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}
