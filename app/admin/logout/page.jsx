"use client";

import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  fetch("/api/logout", { method: "POST" }).then((response) => {
    if (response.ok) {
      router.push("/login");
    }
  });

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontSize: "1.5rem",
      }}
    >
      Saindo...
    </div>
  );
}
