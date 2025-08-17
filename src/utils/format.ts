export const formatDateString = (input: string): string => {
  const [datePart, timePart] = input.split(" ");
  const [day, month, year] = datePart.split("-").map(Number);

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const monthName = monthNames[month - 1] || "";
  return `${String(day).padStart(2, "0")} ${monthName} ${year} ${timePart}`;
};
export function formatIsoDate(isoDate: string, lang: string): string {
  const date = new Date(isoDate);

  const locale = lang === "ar" ? "ar-EG" : "en-US";

  const day = date.getDate();
  const month = date.toLocaleString(locale, { month: "short" }); // e.g., "May" or "مايو"
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const isPM = hours >= 12;
  const period = lang === "ar" ? (isPM ? "م" : "ص") : isPM ? "pm" : "am";

  hours = hours % 12 || 12;

  const formattedTime = `${hours
    .toString()
    .padStart(2, "0")}:${minutes} ${period}`;

  return `${day} ${month} ${year} - ${formattedTime}`;
}
