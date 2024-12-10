import Link from "next/link";
import styles from "./Menu.module.css";

export default function Menu({
  current,
}: {
  current: "blog" | "quark-na-midia" | "alterar-perfil" | "criar";
}) {
  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <h1 className={styles.title}>Admin Quark</h1>
        <Link
          href="/admin/blog"
          className={`${styles.link} ${current === "blog" ? "underlined" : ""}`}
        >
          Blog
        </Link>
        <Link
          href="/admin/quark-na-midia"
          className={`${styles.link} ${
            current === "quark-na-midia" ? "underlined" : ""
          }`}
        >
          Quark na Mídia
        </Link>
        <Link
          href="/admin/alterar-perfil"
          className={`${styles.link} ${
            current === "alterar-perfil" ? "underlined" : ""
          }`}
        >
          Alterar perfil
        </Link>
        <Link
          href="/admin/criar"
          className={`${styles.link} ${
            current === "criar" ? "underlined" : ""
          }`}
        >
          Novo Admin
        </Link>
        <Link href="/admin/logout" className={styles.link}>
          Logout
        </Link>
      </nav>
    </div>
  );
}
