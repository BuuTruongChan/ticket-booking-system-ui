import { describe, expect, it } from "vitest";

import { PAGINATION } from "../../core/constants";
import {
  buildCatalogQueryString,
  readCatalogQueryState,
} from "./catalog-query";

function createSearchParams(query: string) {
  const params = new URLSearchParams(query);

  return {
    get: (name: string) => params.get(name),
    toString: () => params.toString(),
  };
}

describe("catalog-query", () => {
  it("parses catalog query state with normalized pagination and filters", () => {
    const state = readCatalogQueryState(
      createSearchParams(
        "page=3&limit=20&search=festival&status=ON_SALE&dateFrom=2026-04-01&dateTo=2026-04-30",
      ),
    );

    expect(state).toEqual({
      page: 3,
      limit: 20,
      search: "festival",
      status: "ON_SALE",
      location: "",
      category: "",
      dateFrom: "2026-04-01",
      dateTo: "2026-04-30",
    });
  });

  it("falls back to defaults for invalid catalog query values", () => {
    const state = readCatalogQueryState(
      createSearchParams(
        "page=0&limit=999&status=UNKNOWN&search=&dateFrom=&dateTo=",
      ),
    );

    expect(state).toEqual({
      page: PAGINATION.DEFAULT_PAGE,
      limit: PAGINATION.DEFAULT_LIMIT,
      search: "",
      status: "",
      location: "",
      category: "",
      dateFrom: "",
      dateTo: "",
    });
  });

  it("trims text filters and normalizes inverted date ranges", () => {
    const state = readCatalogQueryState(
      createSearchParams(
        "search=%20spring%20&dateFrom=2026-05-31&dateTo=2026-05-01",
      ),
    );

    expect(state).toEqual({
      page: PAGINATION.DEFAULT_PAGE,
      limit: PAGINATION.DEFAULT_LIMIT,
      search: "spring",
      status: "",
      location: "",
      category: "",
      dateFrom: "2026-05-01",
      dateTo: "2026-05-31",
    });
  });

  it("builds a compact query string from catalog state", () => {
    const query = buildCatalogQueryString({
      page: 2,
      limit: 20,
      search: "summer night",
      status: "UPCOMING",
      location: "ho chi minh",
      category: "Concert",
      dateFrom: "2026-05-01",
      dateTo: "2026-05-31",
    });

    expect(query).toBe(
      "page=2&limit=20&search=summer+night&status=UPCOMING&location=ho+chi+minh&category=Concert&dateFrom=2026-05-01&dateTo=2026-05-31",
    );
  });
});
