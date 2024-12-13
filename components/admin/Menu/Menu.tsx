import Link from "next/link";
import styles from "./Menu.module.css";

export default function Menu(props: {
  current: "blog" | "quark-na-midia" | "alterar-perfil" | "criar";
}) {
  const { current } = props;

  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <h1 className={styles.title}>Admin Quark</h1>
        <Link
          href="/admin/blog"
          className={styles.link}
          style={{ textDecoration: current === "blog" ? "underline" : "none" }}
        >
          Blog
        </Link>
        <Link
          href="/admin/quark-na-midia"
          className={styles.link}
          style={{
            textDecoration: current === "quark-na-midia" ? "underline" : "none",
          }}
        >
          Quark na Mídia
        </Link>
        <Link
          href="/admin/alterar-perfil"
          className={styles.link}
          style={{
            textDecoration: current === "alterar-perfil" ? "underline" : "none",
          }}
        >
          Alterar perfil
        </Link>
        <Link
          href="/admin/criar"
          className={styles.link}
          style={{ textDecoration: current === "criar" ? "underline" : "none" }}
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
