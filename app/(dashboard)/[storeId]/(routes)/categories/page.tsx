import { format } from 'date-fns';

import prismadb from '@/lib/prismadb';
import { CategoryColumn } from './components/columns';
import { CategoryClient } from './components/client';

const CategoryPage = async ({ params }: { params: { storeId: string } }) => {
  const Category = await prismadb.category.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      billboard: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  if (!Category) {
    return null;
  }

  const formattedCategory: CategoryColumn[] = Category.map((item) => ({
    id: item.id,
    name: item.name,
    billboardLabel: item.billboard.label,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryClient data={formattedCategory} />
      </div>
    </div>
  );
};

export default CategoryPage;
