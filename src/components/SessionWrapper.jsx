"use client";

import { SessionProvider } from "next-auth/react";

export const SessionWrapper = ({ children, session }) => {
  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  );
};