"use client";

import { CalendarDays, Check, MapPin, Tags, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getDistrictOptions, VN_CITIES } from "@/features/catalog/vn-location";

const CATEGORY_OPTIONS = [
  "Concert",
  "Festival",
  "Sports",
  "Theater",
  "Comedy",
  "Family",
];

type CatalogFilterPanelProps = {
  selectedCity: string;
  selectedDistrict: string;
  defaultCategory: string;
  defaultDateFrom: string;
  defaultDateTo: string;
  onCityChange: (city: string) => void;
  onDistrictChange: (district: string) => void;
  onClose: () => void;
  onReset: () => void;
};

export function CatalogFilterPanel({
  selectedCity,
  selectedDistrict,
  defaultCategory,
  defaultDateFrom,
  defaultDateTo,
  onCityChange,
  onDistrictChange,
  onClose,
  onReset,
}: CatalogFilterPanelProps) {
  const districtOptions = getDistrictOptions(selectedCity);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
      <button
        type="button"
        className="absolute inset-0"
        aria-label="Close filters"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-2xl rounded-2xl border border-border/60 bg-background p-4 shadow-xl">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-medium">Filters</p>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            aria-label="Close filters"
            onClick={onClose}
          >
            <X className="size-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <label className="space-y-2 text-sm">
            <span className="inline-flex items-center gap-2 text-muted-foreground">
              <MapPin className="size-4" /> Location
            </span>
            <select
              name="city"
              value={selectedCity}
              onChange={(event) => {
                onCityChange(event.target.value);
                onDistrictChange("");
              }}
              aria-label="Filter by city"
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">All cities (Vietnam)</option>
              {VN_CITIES.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm">
            <span className="inline-flex items-center gap-2 text-muted-foreground">
              <MapPin className="size-4" /> District
            </span>
            <select
              name="district"
              value={selectedDistrict}
              onChange={(event) => onDistrictChange(event.target.value)}
              aria-label="Filter by district"
              disabled={!districtOptions.length}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="">All districts</option>
              {districtOptions.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm">
            <span className="inline-flex items-center gap-2 text-muted-foreground">
              <Tags className="size-4" /> Category
            </span>
            <select
              name="category"
              defaultValue={defaultCategory}
              aria-label="Filter by category"
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">All categories</option>
              {CATEGORY_OPTIONS.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm">
            <span className="inline-flex items-center gap-2 text-muted-foreground">
              <CalendarDays className="size-4" /> Start date
            </span>
            <Input
              name="dateFrom"
              type="date"
              defaultValue={defaultDateFrom}
              aria-label="Start date"
            />
          </label>

          <label className="space-y-2 text-sm">
            <span className="inline-flex items-center gap-2 text-muted-foreground">
              <CalendarDays className="size-4" /> End date
            </span>
            <Input
              name="dateTo"
              type="date"
              defaultValue={defaultDateTo}
              aria-label="End date"
            />
          </label>
        </div>

        <div className="mt-4 flex items-center justify-end gap-2">
          <Button
            type="button"
            size="icon"
            variant="outline"
            aria-label="Reset filters"
            onClick={onReset}
          >
            <X className="size-4" />
          </Button>
          <Button type="submit" size="icon" aria-label="Apply filters">
            <Check className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
