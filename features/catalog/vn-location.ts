export const VN_CITIES = [
  "Ho Chi Minh City",
  "Ha Noi",
  "Da Nang",
  "Hai Phong",
  "Can Tho",
  "Khanh Hoa",
  "Lam Dong",
  "Dong Nai",
  "Binh Duong",
  "Quang Ninh",
  "Hue",
  "Nghe An",
  "Thanh Hoa",
  "Ninh Binh",
  "Quang Nam",
] as const;

export const VN_DISTRICTS_BY_CITY: Record<string, readonly string[]> = {
  "Ho Chi Minh City": [
    "District 1",
    "District 3",
    "District 4",
    "District 5",
    "District 7",
    "District 10",
    "District 11",
    "District 12",
    "Binh Thanh",
    "Go Vap",
    "Phu Nhuan",
    "Tan Binh",
    "Tan Phu",
    "Thu Duc",
  ],
  "Ha Noi": [
    "Ba Dinh",
    "Cau Giay",
    "Dong Da",
    "Hai Ba Trung",
    "Hoan Kiem",
    "Hoang Mai",
    "Long Bien",
    "Nam Tu Liem",
    "Tay Ho",
    "Thanh Xuan",
  ],
  "Da Nang": ["Hai Chau", "Thanh Khe", "Son Tra", "Ngu Hanh Son", "Lien Chieu"],
  "Hai Phong": ["Hong Bang", "Le Chan", "Ngo Quyen", "Kien An", "Duong Kinh"],
  "Can Tho": ["Ninh Kieu", "Binh Thuy", "Cai Rang", "O Mon", "Thot Not"],
};

export function parseLocationValue(location: string): {
  city: string;
  district: string;
} {
  const normalized = location.trim();
  if (!normalized) {
    return { city: "", district: "" };
  }

  for (const city of VN_CITIES) {
    if (normalized === city) {
      return { city, district: "" };
    }

    if (normalized.startsWith(`${city},`)) {
      return {
        city,
        district: normalized.slice(city.length + 1).trim(),
      };
    }
  }

  return { city: "", district: "" };
}

export function buildLocationValue(city: string, district: string): string {
  const nextCity = city.trim();
  const nextDistrict = district.trim();

  if (!nextCity) {
    return "";
  }

  return nextDistrict ? `${nextCity}, ${nextDistrict}` : nextCity;
}

export function getDistrictOptions(city: string): readonly string[] {
  return VN_DISTRICTS_BY_CITY[city] ?? [];
}
