import type { RefinementCtx } from "zod";

type SaleWindowInput = {
  saleStartDate?: string;
  saleEndDate?: string;
  eventDate?: string;
};

export function validateEventSaleWindow(
  data: SaleWindowInput,
  ctx: RefinementCtx,
): void {
  const { saleStartDate, saleEndDate, eventDate } = data;

  if (!saleStartDate || !saleEndDate || !eventDate) {
    return;
  }

  const saleStart = new Date(saleStartDate).getTime();
  const saleEnd = new Date(saleEndDate).getTime();
  const event = new Date(eventDate).getTime();

  if ([saleStart, saleEnd, event].some(Number.isNaN)) {
    ctx.addIssue({
      code: "custom",
      message: "Invalid date format",
      path: ["saleStartDate"],
    });
    return;
  }

  if (saleStart >= saleEnd) {
    ctx.addIssue({
      code: "custom",
      message: "Sale start must be before sale end",
      path: ["saleEndDate"],
    });
  }

  if (saleEnd >= event) {
    ctx.addIssue({
      code: "custom",
      message: "Sale end must be before event date",
      path: ["eventDate"],
    });
  }
}
