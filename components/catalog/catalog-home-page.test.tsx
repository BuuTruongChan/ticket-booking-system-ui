import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { CatalogHomePage } from "@/components/catalog/catalog-home-page";
import { useCatalogEvents } from "@/hooks/catalog";

const mockReplace = vi.fn();
const mockCatalogEventGrid = vi.fn(
  ({ isRefreshing }: { isRefreshing?: boolean }) => (
    <div data-testid="catalog-grid">
      {isRefreshing ? "grid-refreshing" : "grid"}
    </div>
  ),
);

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({
    replace: mockReplace,
  }),
}));

vi.mock("@/hooks/catalog", () => ({
  useCatalogEvents: vi.fn(),
}));

vi.mock("@/hooks/user", () => ({
  useCurrentUserOrGuest: () => ({ data: null }),
}));

vi.mock("@/components/catalog", () => ({
  CatalogEventGrid: (props: { isRefreshing?: boolean }) =>
    mockCatalogEventGrid(props),
}));

describe("CatalogHomePage UI states", () => {
  const mockedUseCatalogEvents = vi.mocked(useCatalogEvents);

  beforeEach(() => {
    vi.clearAllMocks();
    mockReplace.mockReset();
    mockCatalogEventGrid.mockClear();
  });

  it("keeps search and filters visible during initial loading", () => {
    mockedUseCatalogEvents.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      isFetching: false,
      refetch: vi.fn(),
    } as never);

    render(<CatalogHomePage searchParams={{}} />);

    expect(screen.getByLabelText("Search events")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Open filters" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Loading upcoming events...")).toBeInTheDocument();
    expect(screen.queryByTestId("catalog-grid")).not.toBeInTheDocument();
  });

  it("shows inline error actions while keeping filters visible", () => {
    const refetch = vi.fn();

    mockedUseCatalogEvents.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      isFetching: false,
      refetch,
    } as never);

    render(<CatalogHomePage searchParams={{ search: "rock" }} />);

    expect(screen.getByLabelText("Search events")).toBeInTheDocument();
    expect(screen.getByDisplayValue("rock")).toBeInTheDocument();
    expect(
      screen.getByText("Unable to load events right now."),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Retry" }));
    expect(refetch).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole("button", { name: "Clear filters" }));
    expect(mockReplace).toHaveBeenCalled();
  });

  it("shows grid and refresh hint during background fetching", () => {
    mockedUseCatalogEvents.mockReturnValue({
      data: {
        data: [
          {
            id: "event-1",
            eventCode: "EVT_1",
            eventName: "Rock Night",
            description: "desc",
            venue: "Main Hall",
            venueId: "venue-1",
            eventDate: "2026-04-20T10:00:00.000Z",
            saleStartDate: "2026-04-01T00:00:00.000Z",
            saleEndDate: "2026-04-19T00:00:00.000Z",
            slug: "rock-night",
            organizerId: "org-1",
            createdAt: "2026-04-01T00:00:00.000Z",
            updatedAt: "2026-04-01T00:00:00.000Z",
          },
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
        },
      },
      isLoading: false,
      isError: false,
      isFetching: true,
      refetch: vi.fn(),
    } as never);

    render(<CatalogHomePage searchParams={{}} />);

    expect(screen.getByTestId("catalog-grid")).toHaveTextContent(
      "grid-refreshing",
    );
    expect(screen.getByText("Refreshing data...")).toBeInTheDocument();
    expect(mockCatalogEventGrid).toHaveBeenCalled();
  });
});
