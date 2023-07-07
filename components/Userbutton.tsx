'use client';
import { UserButton } from '@clerk/clerk-react';
import React from 'react';

const Userbutton = () => {
  return <UserButton afterSignOutUrl="/" />;
};

export default Userbutton;
