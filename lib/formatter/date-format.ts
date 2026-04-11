const mediumDateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
});

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

function parseDate(value: string): Date | null {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function formatMediumDate(value: string): string {
  const parsed = parseDate(value);
  return parsed ? mediumDateFormatter.format(parsed) : "Invalid date";
}

export function formatDateTime(value: string): string {
  const parsed = parseDate(value);
  return parsed ? dateTimeFormatter.format(parsed) : "Invalid date";
}
