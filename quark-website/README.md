# Quark Website

<div style="display: flex; justify-content: center">
<img src="https://th.bing.com/th/id/OIP.nX3dNvxHPZFMwSWmjIKMdAHaHa?rs=1&pid=ImgDetMain" width="300" height="250">
</div>


 ## Descrição

Este projeto tem como objetivo desenvolver um site informativo moderno e intuitivo, projetado para oferecer aos usuários uma experiência única e acessível, com conteúdo relevante e atualizado sobre as habilidades comportamentais do século XXI com a plataforma quark.  A **Quark** é uma plataforma de **educação focada no desenvolvimento de habilidades comportamentais**, que oferece cursos e treinamentos voltados para aprimorar competências como liderança, comunicação, inteligência emocional, resolução de conflitos e trabalho em equipe. A plataforma utiliza metodologias inovadoras, como aprendizagem gamificada e conteúdos interativos, para proporcionar uma experiência de aprendizado envolvente e prática. Seu objetivo é ajudar indivíduos e organizações a desenvolverem habilidades essenciais para o sucesso pessoal e profissional, promovendo um ambiente mais colaborativo, produtivo e saudável.

**Redes sociais**:
<div style="display: flex; align-items: center;">
  <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" alt="Instagram" style="margin-right: 10px; width: 24px; height: 24px;">
  <a href="https://instagram.com/edu.quark">Instagram</a>

</div>
<div style="display: flex; align-items: center;">
  <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook" style="margin-right: 10px; width: 24px; height: 24px;">
  <a href="https://facebook.com/edu.quarkk">facebook</a>
</div>

<div style="display: flex; align-items: center;">
  <img src="https://img.icons8.com/fluency/100/google-play-store-new.png" alt="Play Store" style="margin-right: 10px; width: 24px; height: 24px;">
  <a href="https://play.google.com/store/apps/details?id=br.com.eduquark">Play Store</a>
</div>

<div style="display: flex; align-items: center;">
  <img src="https://img.icons8.com/ios-filled/24/apple-app-store--v2.png" alt="App Store" style="margin-right: 10px; width: 24px; height: 24px;">
  <a href="https://apps.apple.com/br/app/quark/id1610958564">App Store</a>
</div>





# Tecnologias Usadas

- **Frontend**: React , tailwind e Next.Js.
- **Backend**: Node.js e next.js.
- **Banco de Dados**: PostgreSQL e Prisma .
- **serviços externos**: AWS SES (serviço de email.) e AWS S3 ( servico de armazenamento de imagem.)



# Estrutura do Projeto

quark/
├── public/          # Arquivos públicos (index.html, imagens)
├── components/      # Componentes reutilizáveis (botões, cabeçalhos, formulários, etc.)
├── lib/             # Funções e bibliotecas reutilizáveis, como helpers, utilitários
├── app/             # Lógica principal da aplicação, incluindo configuração da API
│   ├── api/         # Interações com a API e backend
├── middleware.ts    # Middleware (funções intermediárias) que processam as requisições
├── .env             # Variáveis de ambiente
└── README.md        # Documentação principal do projeto


## Como Rodar o Projeto Localmente

### Pré-requisitos
Antes de começar, certifique-se de ter as seguintes dependências instaladas:
- **Next.Js** (Versão 15.0.3)
- **npm** ou **yarn** (gerenciador de pacotes)
- **PostgreSQL** (para o banco de dados local, caso o backend precise)
- **Docker** (se for usar containers para o ambiente de desenvolvimento)

### Passo a Passo

1. Clone o repositório:

   git clone https://github.com/usuario/quark.git

2. Acesse o diretório do projeto:

   cd quark

3. Instale as dependências do frontend:

   npm install # ou yarn

# Configuração do Backend


1.  Instale as dependências do backend:

      cd app
npm install # ou yarn


 ## Documentação da API


 # Administração (/admin)

 1. PATCH /api/admin/change-email

 Altera o e-mail do usuário autenticado.

 **Autenticação**: Requer autenticação (decorado com **@requiresAuthentication**).

**Descrição**: Permite ao usuário autenticado alterar seu e-mail.
Estrutura  da requisição:

```json
{
  "email": "email@example.com",
  "newEmail": "gabrielvedova@gmail.com",
  "newEmailConfirmation": "gabrielvedova@gmail.com"
}
```

**Resposta** (200 OK):

```json
{
  "message": "E-mail alterado com sucesso"
}
```

**Resposta** (400 Bad Request):

```json
{
  "error": /* erros */
}
```

**Resposta** (401 Unauthorized):

```json
{
  "message": "Não autorizado."
}
```
**Resposta**  (404 Not found)
``` json
  {
  "mensage":"Usuário não encontrado",
  }
```
**Resposta** (409 Conflict)
```json
{
  "error": {
    "newEmail": ["Email já em uso"]
  }
}
```
**Resposta** ( 500 Internal Server Error)
```json
{
  "error": {
    "message": ["Ocorreu um erro."]
    }
}
```


2.  PATCH /api/admin/change-password

Altera a senha do usuário autenticado.

**Autenticação**: Requer autenticação geral.

**Descrição**: Permite ao usuário autenticado alterar sua senha.

Estrutura de requisição:
```json
{
 "password": "2345667",
 "newpassword": "0987654"
 "newPasswordConfirmation": "0987654"
}
```
**Resposta** (200 OK):
```json
{
  "message": "Senha alterada com sucesso."
}
```

**Resposta**  (400 Bad Request):
```json
{
  "error": /* erros */
}
```
**Resposta** (401 Unauthorized)

```json
{
 "message": "Não autorizado."
}
```
**Resposta** (401 Unauthorized)
```json
  {
    "message": "Não autorizado."
  }
  ```
  **Resposta** (404 Not Found)
```json
{
  "message": "Usuário não encontrado"
}

```
**Resposta** (500 Internal Server Error)

```json
{
   "message": "Ocorreu um erro."
}
```

3. CREATE /api/create-admin
  Cria um novo usuário

**Autenticação**: Requer autenticação para garantir que apenas administradores possam criar novos administradores.

**Descrição**: Cria um novo usuário com a permissão de administrador no sistema.

Estrutura de Requisição:
```json
{
  "name": "Gabriel"
  "role": "CEO"
  "password": "1234"
  "passwordconfirmation": "1234"

}
```
**Resposta** (200 OK):
```json
{
  "message": "Admin criado com sucesso."
}
```
**Resposta**  (400 Bad Request):
```json
{
  "error": /* erros */
}
```
**Resposta** (409 Conflict)
```json
{
  "error": {
    "Email": ["Email já em uso"]
  }
}
```
**Resposta** (500 Internal Server Error)

```json
{
   "message": "Ocorreu um erro."
}
```


4.  DELETE /api/admin/delete

Exclui um usuário do sistema.

**Autenticação**: Requer autenticação (decorado com **@requiresAuthentication**).

**Descrição**: Exclui um usuário do sistema usando seu ID.


**Resposta** (204 No Content)


**Resposta** (401 Unauthorized)

```json
  {
    "message": "Não autorizado."
  }
  ```
**Resposta** (500 Internal Server Error)

```json
{
   "message": "Ocorreu um erro."
}
```


5. PUT /api/admin/edit-info

Edita as informações do usuário autenticado.

**Autenticação**: Requer autenticação (decorado com **@requiresAuthentication**).

**Descrição**: Edita as informações do usuário autenticado.
Estrutura da requisição:
```json
{
  "name": "gabriel della (atualizado)",
  "role": "CFO"
  "profilePicture"
}
```
**Resposta** (204 No Content):


**Resposta**  (400 Bad Request):
```json
{
  "error": /* erros */
}
```

**Resposta** (401 Unauthorized)

```json
  {
    "message": "Não autorizado."
  }
  ```
**Resposta** (404 Not Found)
```json
{
  "message": "Perfil não encontrado"
}
```

**Resposta** (500 Internal Server Error)

```json
{
   "message": "Ocorreu um erro."
}
```

6.  POST /api/admin/logout

Desfaz a autenticação do usuário, encerrando a sessão.

**Autenticação**: Requer autenticação (decorado com **@requiresAuthentication**).

**Descrição**: Realiza o logout do usuário.

**Resposta** (204 No Content):

7. Blog (/blog/posts)
 POST /api/blog/posts

Cria novos post

**Autenticação**: Requer autenticação (decorado com **@requiresAuthentication**)

**Descrição**: cria novos post.

Estrutura de requisição:
```json
{
  "title": "homem morre em afogados"
  "content":
  "published":
  "miniature":
}
```
**Resposta** (201 Created):
```json
{
  "id": "3456"
}
```
**Resposta**  (400 Bad Request):
```json
{
  "error": /* erros */
}
```
**Resposta** (401 Unauthorized)

```json
  {
    "message": "Não autorizado."
  }
  ```
  **Resposta** (500 Internal Server Error)

```json
{
   "message": "Ocorreu um erro."
}
```


8. GET /api/blog

lista todas as postagens do blog, ou uma liata filtrada ou um post especifico.

**Autenticação**: Requer autenticação (decorado com **@requiresAuthentication**) caso queira um post não publicado.

**Descrição**:
Estrutura da requisição: Lista todas as postagens do blog, ou uma liata filtrada ou um post especifico.

**parametros**: (Query)

```typescript
id: number;
search: string;
published: boolean;
```
**Resposta** (200 OK):

```json
{
  "data": /* vetor contendo os posts resultantes */
}
```

**Resposta**  (400 Bad Request):
```json
{
  "error": /* erros */
}
```
**Resposta** (401 Unauthorized)

```json
  {
    "message": "Não autorizado."
  }
  ```


9.  PUT /api/blog/posts

Edita um post existente.

**Autenticação**: Requer autenticação (decorado com **@requiresAuthentication**).

**Descrição**: Edita um post existente no blog.

Estrutura da requisição:
```json
{
  "id": 1,
  "newtitle": "Post 1 Atualizado",
  "content": "Novo conteúdo do post 1"
  "published":
"newminiature":

}
```
**Resposta** (204 No Content):

**Resposta**  (400 Bad Request):
```json
{
  "error": /* erros */
}
```
**Resposta** (404 Not Found)
```json
{
  "message": "Post não encontrado"
}
```
  **Resposta** (500 Internal Server Error)

```json
{
   "message": "Ocorreu um erro."
}
```


10. DELETE /api/blog/posts

Exclui um post do blog.

**Autenticação**: Requer autenticação (decorado com **@requiresAuthentication**).

**Descrição**: Exclui um post do blog.

id: ID do post a ser excluído.

**Resposta** (204 No Content):

**Resposta**  (400 Bad Request):
```json
{
  "error": /* erros */
}
```

**Resposta** (404 Not Found):
```json
{
  "erro": "Post não encontrado"
}
```
  **Resposta** (500 Internal Server Error)

```json
{
   "message": "Ocorreu um erro."
}
```
11. Contato (/fale-conosco)
 POST /api/fale-conosco

Envia uma mensagem de contato.

**Autenticação**: Não requer autenticação.

**Descrição**: Permite que o usuário envie uma mensagem através do formulário de contato.

Estrutura da requisição:
```json
{
  "name": "caio manoel",
  "email": "caio@dominio.com",
  "phonenumber":"23456789"
  "institution": "ETE PORTO DIGITAL"
}
```
**Resposta** (204 No Content):

**Resposta**  (400 Bad Request):
```json
{
  "error": /* erros */
}
```
**Resposta** (401 Unauthorized)

```json
  {
    "message": "Não autorizado."
  }
  ```
  **Resposta** (500 Internal Server Error)

```json
{
   "message": "Ocorreu um erro."
}
```

Login (/login)
 1. POST /api/login

Autentica um usuário.

**Autenticação**: Não requer autenticação (é o primeiro ponto de entrada para obter um token).

**Descrição**: Realiza o login do usuário com e-mail e senha.

Estrutura da requisição:

{
  "email": "joao@dominio.com",
  "senha": "senha123"
}
**Resposta** (200 OK):
```json
{
  "token": "JWT_TOKEN_AQUI"
}
```
**Resposta**  (400 Bad Request):
```json
{
  "error": /* erros */
}
```
**Resposta** (401 Unauthorized)

```json
{
  "Email ou Senhas incorretos."
}

```

**Resposta** (500 Internal Server Error)

```json
{
   "message": "Ocorreu um erro."
}
```


2. Quark na Mídia (/quark-na-midia)
 GET /api/quark-na-midia

obtenhe uma lista de manchetes

**Autenticação**: Não requer autenticação.

**Descrição**: obter uma manchete

**Resposta** (200 OK):
```json
{
  "token": "A lista de títulos que correspondem à consulta de pesquisa"
}

```
**Resposta**  (400 Bad Request):

```json
{
  "error": /* erros */
}
```
**Resposta** (401 Unauthorized)

```json
{
  "A lista de títulos que correspondem à consulta de pesquisa"

}
```

**Resposta** (404 Not Found):
```json
{
  "erro": "Manchete não encontrada"
}
```
  **Resposta** (500 Internal Server Error)

```json
{
   "message": "Ocorreu um erro."
}
```
## Créditos

**Front-end:** [Gabriel Vedova](https://linkedin.com/in/gabrielvedova)
**Back-end:** [Caio de Araujo](https://linkedin.com/in/caiotdearaujo)
**documentação**: [Breno cunha](https://www.linkedin.com/in/breno-cunha-2a49a9302?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app )
