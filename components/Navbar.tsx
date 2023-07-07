import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React from 'react';
import StoreSwitcher from './StoreSwitcher';
import Userbutton from './Userbutton';
import { MainNav } from './MainNav';
import { ThemeToggle } from './ThemeToggle';

const Navbar = async () => {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const stores = await prismadb.store.findMany({
    where: {
      userId,
    },
  });
  return (
    <div className="flex justify-between h-16 items-center px-4 border-b">
      <StoreSwitcher items={stores} />
      <MainNav className="mx-6" />
      <div className="ml-auto flex items-center space-x-4 w-auto">
        <ThemeToggle />
        <Userbutton />
      </div>
    </div>
  );
};

export default Navbar;
