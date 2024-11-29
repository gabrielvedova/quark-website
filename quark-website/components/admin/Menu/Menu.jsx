import Link from "next/link";
import "./styles.css";

export default function Menu({ current }) {
  return (
    <div>
      <nav>
        <h1>Admin Quark</h1>
        <Link
          id="blogLink"
          href="/admin/blog"
          className={current === "blog" ? "underlined" : ""}
        >
          Blog
        </Link>
        <Link
          id="headlineLink"
          href="/admin/quark-na-midia"
          className={current === "quark-na-midia" ? "underlined" : ""}
        >
          Quark na Mídia
        </Link>
        <Link
          id="changeInfoLink"
          href="/admin/alterar-perfil"
          className={current === "alterar-perfil" ? "underlined" : ""}
        >
          Alterar perfil
        </Link>
        <Link
          id="newAdminLink"
          href="/admin/criar"
          className={current === "criar" ? "underlined" : ""}
        >
          Novo Admin
        </Link>
        <Link id="logoutLink" href="/admin/logout">
          Logout
        </Link>
      </nav>
    </div>
  );
}
