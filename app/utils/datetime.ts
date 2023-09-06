/**
 * Format a date to a string
 * @param date Date to format
 * @returns Formatted date
 * @example
 * formatDateTime(new Date("2021-01-01T00:00:00.000Z"))
 * // => "2021-01-01 00:00 JST"
 */
export const formatDateTime = (date: Date | string) => {
  if (typeof date === "string") {
    date = new Date(date);
  }
  return date.toLocaleString("ja-JP", {
    timeZone: "Asia/Tokyo",
    timeZoneName: "short",
  });
};
