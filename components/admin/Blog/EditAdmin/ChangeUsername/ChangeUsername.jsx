import styles from "./ChangeUsername.module.css";

export default function ChangeUsername() {
  return (
    <div className={styles.container}>
      <h1>Alterar Username</h1>
      <div className={styles.inputContainer}>
        <input type="text" name="username" id="" placeholder="Username atual" />
        <input
          type="text"
          name="newUsername"
          id=""
          placeholder="Novo username"
        />
        <input
          type="text"
          name="confirmNewUsername"
          id=""
          placeholder="Confirmar novo username"
        />
      </div>
      <div className={styles.buttons}>
        <button>Cancelar</button> {/* Retorna para a página do meu perfil */}
        <button>Salvar</button>{" "}
        {/* Abre um popUp para assim salvar o novo username */}
      </div>
    </div>
  );
}
