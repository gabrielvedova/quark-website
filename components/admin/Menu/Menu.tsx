import Link from "next/link";
import styles from "./Menu.module.css";

interface MenuProps {
  current: "quark-na-midia" | "meu-perfil" | "novo";
}

export default function Menu(props: MenuProps) {
  const { current } = props;

  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <h1 className={styles.title}>Admin Quark</h1>
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
          href="/admin/meu-perfil"
          className={styles.link}
          style={{
            textDecoration: current === "meu-perfil" ? "underline" : "none",
          }}
        >
          Meu Perfil
        </Link>
        <Link
          href="/admin/novo"
          className={styles.link}
          style={{ textDecoration: current === "novo" ? "underline" : "none" }}
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
