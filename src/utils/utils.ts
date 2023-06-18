export function formatText(text: string) {
  if (typeof text !== "string") {
    console.error(`Não foi possível formatar o ${text}`);
  }

  return text
    .replace(/\b(\s)\b|[-]/g, "_")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase();
}
