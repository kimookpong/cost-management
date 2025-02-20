"use client"; // ✅ ต้องเพิ่ม

import { useSession, signOut } from "next-auth/react";

export default function Dashboard() {
  const { data: session } = useSession();

  return (
    <main>
      <h1>Welcome, {session.user.name}</h1>
      <button onClick={() => signOut()}>Logout</button>
    </main>
  );
}
