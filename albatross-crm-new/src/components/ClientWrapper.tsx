"use client";

import React, { ReactNode } from 'react';

interface ClientWrapperProps {
  children: ReactNode;
}

const ClientWrapper: React.FC<ClientWrapperProps> = ({ children }) => {

  return (
    <>
      {/* You can use someState here if needed */}
      {children}
    </>
  );
};

export default ClientWrapper;