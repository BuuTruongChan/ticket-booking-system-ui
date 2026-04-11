export type RouteSearchParams = Record<string, string | string[] | undefined>;

export function toURLSearchParams(
  searchParams: RouteSearchParams,
): URLSearchParams {
  const urlParams = new URLSearchParams();

  Object.entries(searchParams).forEach(([key, value]) => {
    if (typeof value === "string") {
      urlParams.set(key, value);
      return;
    }

    if (Array.isArray(value) && value[0]) {
      urlParams.set(key, value[0]);
    }
  });

  return urlParams;
}
