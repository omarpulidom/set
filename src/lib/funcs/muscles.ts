export function formatMuscles(description: string) {
  return description
    .toLowerCase()
    .replace(/,\s*|\s+y\s+/g, '|')
    .split('|')
    .map((muscle) => muscle.trim().replace(/^./, (letter) => letter.toUpperCase()))
    .join(' | ')
}
