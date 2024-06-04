export function urlReplace(
  id,
  url: string,
  target: string,
  replacement: string,
): string {
  if (url === null) {
    return null;
  }

  const urlFormatted = url.replace(target, replacement);

  return `${urlFormatted}&id=${id}`;
}
