"use client";

import { type FormEvent, useState } from "react";
import { ChevronsRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getBoundedPageJump } from "@/lib/query";
import { cn } from "@/lib/utils";

type PaginationControlsProps = {
  currentPage: number;
  totalPages: number;
  total: number;
  totalLabel?: string;
  isFetching?: boolean;
  onPageChange: (page: number) => void;
  className?: string;
};

export function PaginationControls({
  currentPage,
  totalPages,
  total,
  totalLabel = "items",
  isFetching = false,
  onPageChange,
  className,
}: PaginationControlsProps) {
  const [isPageJumpOpen, setIsPageJumpOpen] = useState(false);
  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  function handlePageJumpSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const bounded = getBoundedPageJump(
      String(formData.get("pageJump") ?? currentPage),
      currentPage,
      totalPages,
    );
    onPageChange(bounded);
    setIsPageJumpOpen(false);
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-2xl border border-border/60 bg-background/80 p-4 md:flex-row md:items-center md:justify-between",
        className,
      )}
    >
      <p className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
        {total > 0 ? ` • ${total} ${totalLabel}` : ""}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={!hasPrevious || isFetching}
          onClick={() => onPageChange(currentPage - 1)}
          data-agent-type="action"
          data-entity-type="pagination-prev"
          data-mutation-trigger="paginate"
        >
          Previous
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={!hasNext || isFetching}
          onClick={() => onPageChange(currentPage + 1)}
          data-agent-type="action"
          data-entity-type="pagination-next"
          data-mutation-trigger="paginate"
        >
          Next
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={isPageJumpOpen ? "Hide page jump" : "Show page jump"}
          onClick={() => setIsPageJumpOpen((open) => !open)}
          data-agent-type="action"
          data-entity-type="pagination-jump-toggle"
          data-mutation-trigger="toggle-page-jump"
        >
          <ChevronsRight className="size-4" />
        </Button>
        {isPageJumpOpen ? (
          <form
            key={currentPage}
            onSubmit={handlePageJumpSubmit}
            className="flex items-center gap-2"
          >
            <Input
              name="pageJump"
              type="number"
              min={1}
              max={totalPages}
              defaultValue={currentPage}
              aria-label="Jump to page"
              className="w-20"
              data-agent-type="input"
              data-entity-type="pagination-page-jump"
            />
            <Button
              type="submit"
              variant="ghost"
              data-agent-type="action"
              data-entity-type="pagination-page-go"
              data-mutation-trigger="paginate"
            >
              Go
            </Button>
          </form>
        ) : null}
      </div>
    </div>
  );
}
