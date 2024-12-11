export default function NewAdmin() {
  return (
    <div>
      <h1>Novo Admin</h1>
      <form>
        <div>
          <img src="" alt="" />
          <input type="file" name="IMG" id="" />
        </div>
        <div>
          <h3>Nome</h3>
          <input type="text" id="name" />
        </div>
        <div>
          <h3>E-mail</h3>
          <input type="email" id="email" />
        </div>
        <div>
          <h3>Senha</h3>
          <input type="password" id="password" />
        </div>
        <div>
          <h3>Confirmar Senha</h3>
          <input type="password" id="confirmPassword" />
        </div>
        <button type="submit">Salvar</button>
      </form>
    </div>
  );
}
