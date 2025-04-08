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

export function convertDateTimeToISO(date: Date, timeStr: string): string {
  // Extract year, month, and day from the Date object
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Get month in two digits
  const day = date.getDate().toString().padStart(2, '0'); // Get day in two digits

  // Parse the time string (e.g., "02:30 PM")
  const timeParts = timeStr.match(/^(\d{1,2}):(\d{2}) (AM|PM)$/);
  if (!timeParts) {
    throw new Error("Invalid time format");
  }
  let [, hour, minute, period] = timeParts;
  let hourStr = parseInt(hour, 10);

  // Convert hour based on AM/PM
  if (period === "AM" && hourStr === 12) {
    hourStr = 0; // Midnight case (12 AM -> 00)
  } else if (period === "PM" && hourStr !== 12) {
    hourStr += 12; // Convert PM to 24-hour format
  }

  // Format the time in "HH:MM" format
  const formattedTime = `${hourStr.toString().padStart(2, "0")}:${minute}`;

  // Combine the date and time into "YYYY-MM-DD HH:MM:SS" format
  return `${year}-${month}-${day} ${formattedTime}:00`;
}

export function addHoursToDateTime(dateTime: string, hoursToAdd: number): string {
  // Parse the input dateTime string into a Date object
  const [datePart, timePart] = dateTime.split(" ");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute, second] = timePart.split(":").map(Number);

  // Create a Date object from the parsed values
  const date = new Date(year, month - 1, day, hour, minute, second);

  // Add the specified hours to the Date object
  date.setHours(date.getHours() + hoursToAdd);

  // Format the new Date object to the "YYYY-MM-DD HH:MM:SS" format
  const newYear = date.getFullYear();
  const newMonth = (date.getMonth() + 1).toString().padStart(2, "0");
  const newDay = date.getDate().toString().padStart(2, "0");
  const newHour = date.getHours().toString().padStart(2, "0");
  const newMinute = date.getMinutes().toString().padStart(2, "0");
  const newSecond = date.getSeconds().toString().padStart(2, "0");

  return `${newYear}-${newMonth}-${newDay} ${newHour}:${newMinute}:${newSecond}`;
}

export function calculateCompositeScore(
  sumOfRating: number,
  totalReviews: number,
  defaultScore = 0,
  decimalPlaces = 1,
): number {
  if (totalReviews <= 0) return defaultScore

  const score = sumOfRating / totalReviews
  const multiplier = Math.pow(10, decimalPlaces)
  return Math.round(score * multiplier) / multiplier
}