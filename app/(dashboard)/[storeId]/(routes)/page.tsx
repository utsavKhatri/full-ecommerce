import prismadb from '@/lib/prismadb';

const DashboardPage = async ({
  params,
}: {
  params: {
    storeId: string;
  };
}) => {
  const { storeId } = params;
  const store = await prismadb.store.findFirst({
    where: {
      id: storeId,
    },
  });
  return <div className="w-full">DashboardPage : {store?.name}</div>;
};

export default DashboardPage;
