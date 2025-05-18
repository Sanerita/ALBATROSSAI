"use client";

import React, { useState, ReactNode } from 'react';

interface ClientWrapperProps {
  children: ReactNode;
}

const ClientWrapper: React.FC<ClientWrapperProps> = ({ children }) => {
  // You can add your useState logic here
  const [someState, setSomeState] = useState(null);

  return (
    <>
      {/* You can use someState here if needed */}
      {children}
    </>
  );
};

export default ClientWrapper;