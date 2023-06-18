export function formatText(text: string) {
  if (typeof text === "string") {
    return text
      .replace(/\b(\s)\b|[-]/g, "_")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase();
  }
  return "";
}
