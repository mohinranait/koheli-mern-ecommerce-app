import CategoryComponent from "@/components/pages/category/category-component";

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  return <CategoryComponent slug={params?.slug} />;
}
