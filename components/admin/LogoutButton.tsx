"use client";

import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase-browser";

export default function LogoutButton() {
  const router = useRouter();

  async function salir() {
    await supabaseBrowser.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={salir}
      className="enlace-peligro"
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        font: "inherit",
        fontSize: "13.5px",
      }}
    >
      Cerrar sesión
    </button>
  );
}
