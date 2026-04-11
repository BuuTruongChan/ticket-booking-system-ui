import { CatalogHomePage } from "@/components/catalog/catalog-home-page";

type HomePageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export default function Home({ searchParams }: HomePageProps) {
  return <CatalogHomePage searchParams={searchParams} />;
}
