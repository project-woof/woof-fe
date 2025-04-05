export function convertTimeLocal(timeStr: string): string {
  const [datePart, timePart] = timeStr.split(" ");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute, second] = timePart.split(":").map(Number);

  // Create a Date using user's local timezone.
  const localDate = new Date(year, month - 1, day, hour, minute, second);

  // Format to "HH:MM AM/PM"
  return localDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function convertDateLocal(timeStr: string): string {
  // Split out the date portion ("2025-03-29")
  const [datePart] = timeStr.split(" ");
  const [year, month, day] = datePart.split("-").map(Number);
  // Create a local Date object (month is zero-based).
  const localDate = new Date(year, month - 1, day);
  // Format date as "Mar 29, 2025"
  return localDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
