export function formatDateFromISO(dateString: string): string {
  if (!dateString) return "";

  const [datePart] = dateString.split("T"); // 2026-02-01
  const [year, month, day] = datePart.split("-");

  return `${day}-${month}-${year}`;
}
