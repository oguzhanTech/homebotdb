const WORDS_PER_MINUTE = 200;

function countWords(text: string): number {
  const plain = text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#>*_~`[\]()|-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!plain) return 0;
  return plain.split(" ").length;
}

export function getReadingTimeMinutes(text: string): number {
  const words = countWords(text);
  if (words === 0) return 1;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

export function formatReadingTime(minutes: number): string {
  return `${minutes} min`;
}

export function getUpdateReadingTimeMinutes(update: {
  summary: string;
  content: string;
}): number {
  return getReadingTimeMinutes(`${update.summary}\n\n${update.content}`);
}

export function formatUpdateReadingTime(update: {
  summary: string;
  content: string;
}): string {
  return formatReadingTime(getUpdateReadingTimeMinutes(update));
}
