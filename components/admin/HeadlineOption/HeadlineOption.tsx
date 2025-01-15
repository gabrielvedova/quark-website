"use router";

import { Headline } from "@/lib/definitions";
import styles from "./HeadlineOption.module.css";
import Link from "next/link";
import { MdOutlineDeleteForever, MdOutlineEdit } from "react-icons/md";
import { useRouter } from "next/navigation";

interface HeadlineOptionProps {
  headline: Headline;
  fetchHeadlines: () => Promise<void>;
  setError: (error: string) => void;
  setConfirmationPopup: (
    confirmationPopup: {
      message: string;
      onConfirm: () => Promise<void>;
    } | null
  ) => void;
}

export default function HeadlineOption(props: HeadlineOptionProps) {
  const { headline, fetchHeadlines, setError, setConfirmationPopup } = props;

  const router = useRouter();

  let month: string;
  switch (new Date(headline.publishingDate).getMonth()) {
    case 0:
      month = "Janeiro de ";
      break;
    case 1:
      month = "Fevereiro de ";
      break;
    case 2:
      month = "Março de ";
      break;
    case 3:
      month = "Abril de ";
      break;
    case 4:
      month = "Maio de ";
      break;
    case 5:
      month = "Junho de ";
      break;
    case 6:
      month = "Julho de ";
      break;
    case 7:
      month = "Agosto de ";
      break;
    case 8:
      month = "Setembro de ";
      break;
    case 9:
      month = "Outubro de ";
      break;
    case 10:
      month = "Novembro de ";
      break;
    case 11:
      month = "Dezembro de ";
      break;
    default:
      month = "";
  }

  const formattedDate = `${month}${new Date(
    headline.publishingDate
  ).getFullYear()}`;

  const handleDeleteHeadline = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    setConfirmationPopup({
      message: "Você deseja realmente excluir esta manchete?",
      onConfirm: async () => {
        const response = await fetch("/api/quark-na-midia", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: headline.id }),
        });

        if (response.ok) {
          return fetchHeadlines();
        }

        const { message } = (await response.json()) as { message: string };

        for (let i = 3; i > 0; i--) {
          setError(`${message} Recarregando página em ${i}`);
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        router.refresh();
      },
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.headlineOption}>
        <header className={styles.header}>
          <div className={styles.titleContainer}>
            <h3 className={styles.title}>{headline.title}</h3>
            <p className={styles.href}>
              URL de destino:{" "}
              <Link href={headline.url} className={styles.url}>
                {new URL(headline.url).host.toString()}
              </Link>
            </p>
            <p className={styles.publishingDate}>{formattedDate}</p>
          </div>
          <div className={styles.options}>
            <Link href={`/admin/quark-na-midia/editar/${headline.id}`}>
              <button className={styles.edit} title="Editar">
                <MdOutlineEdit size={25} />
              </button>
            </Link>
            <button
              className={styles.delete}
              onClick={handleDeleteHeadline}
              title="Excluir"
            >
              <MdOutlineDeleteForever size={25} />
            </button>
          </div>
        </header>
        <section className={styles.info}>
          <p className={styles.description}>{headline.description}</p>
        </section>
      </div>
    </div>
  );
}
