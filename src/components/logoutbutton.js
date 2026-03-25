"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  async function handleLogout() {
    await signOut({ redirectTo: "/" });
  }

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 text-white hover:bg-black rounded-full transition text-[20px]"
    >
      Logout
    </button>
  );
}
