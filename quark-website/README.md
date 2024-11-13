# Quark Website

<div style="display: flex; justify-content: center">
<img src="https://th.bing.com/th/id/OIP.nX3dNvxHPZFMwSWmjIKMdAHaHa?rs=1&pid=ImgDetMain" width="300" height="250">
</div>

## Descrição

Este projeto tem como objetivo desenvolver um site informativo moderno e intuitivo, projetado para oferecer aos usuários uma experiência única e acessível, com conteúdo relevante e atualizado sobre as habilidades comportamentais do século XXI com a plataforma quark. A **Quark** é uma plataforma de **educação focada no desenvolvimento de habilidades comportamentais**, que oferece cursos e treinamentos voltados para aprimorar competências como liderança, comunicação, inteligência emocional, resolução de conflitos e trabalho em equipe. A plataforma utiliza metodologias inovadoras, como aprendizagem gamificada e conteúdos interativos, para proporcionar uma experiência de aprendizado envolvente e prática. Seu objetivo é ajudar indivíduos e organizações a desenvolverem habilidades essenciais para o sucesso pessoal e profissional, promovendo um ambiente mais colaborativo, produtivo e saudável.

### Redes sociais

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

---

## Tecnologias Usadas

- **Frontend**: React , tailwind e Next.Js.
- **Backend**: Node.js e next.js.
- **Banco de Dados**: PostgreSQL e Prisma .
- **serviços externos**: AWS SES (serviço de email.) e AWS S3 ( servico de armazenamento de imagem.)

---

## Estrutura do Projeto

```txt
quark/
├── public/ # Arquivos públicos (index.html, imagens)
├── components/ # Componentes reutilizáveis (botões, cabeçalhos, formulários, etc.)
├── lib/ # Funções e bibliotecas reutilizáveis, como helpers, utilitários
├── app/ # Lógica principal da aplicação, incluindo configuração da API
│   └── api/ # Interações com a API e backend as requisições
├── .env # Variáveis de ambiente
└── README.md # Documentação principal do projeto
```

---

## Como Rodar o Projeto Localmente

### Pré-requisitos

Antes de começar, certifique-se de ter as seguintes dependências instaladas:

- **Next.Js** (Versão 15.0.3)
- **npm** ou **yarn** (gerenciador de pacotes)
- **PostgreSQL** (para o banco de dados local, caso o backend precise)
- **Docker** (se for usar containers para o ambiente de desenvolvimento)

### Passo a Passo

1 - Clone o repositório:

```bash
git clone <https://github.com/gabrielvedova/quark-website.git>
```

2 - Acesse o diretório do projeto:

```bash
cd quark-website/
```

3 - Instale as dependências do frontend:

```bash
npm install # ou yarn
```

4 - Configure as váriáveis de ambiente em `.env`

```env
# Next.js
NEXT_PUBLIC_BASE_URL='' # A URL base em que o projeto está sendo executado

# Mailing service
MAIL_HOST=''
MAIL_PORT=
MAIL_USER=''
MAIL_PASS=''

EMAIL_NAME='' # Nome do receptor do email
EMAIL_ADDRESS='' # Endereço de email a receber o contato

MAIL_API_SECRET='' # Bearer token da API de email

# Database credentials
DATABASE_URL='' # Prisma configuration

# Node environment
NODE_ENV='' # 'production' | 'development'

# session encription secret
SESSION_SECRET='' # Segredo de encriptação do token de sessão
```

---

## Autenticação

<!--> Explicar tipos de autenticação <!-->

### Sessões

As sessões são guardadas no banco de dados e são encriptografadas com um segredo definido nas variáveis de ambiente. Elas são usadas para autenticar usuários e manter a sessão ativa enquanto o usuário estiver logado. As sessões são encerradas quando o usuário faz logout ou quando o token expira. As sessões armazenam o ID do usuário e a data de expiração do token.

Este meio de autenticação é considerado o principal, sua finalidade é proteger páginas e rotas que só devem ser acessadas pelos administradores do sistema, como edição de postagens, manchetes, informações de perfis e gerenciamento de usuários.

O cookie responsável por armazenar a sessão é seguro e possui as seguintes configurações:

- **httpOnly**: O cookie só pode ser acessado pelo servidor.
- **secure**: O cookie só é enviado em conexões seguras (HTTPS).
- **sameSite**: O cookie só é enviado se a requisição for do mesmo site.

Seu nome é `session` e seu valor é o token de sessão encriptografado.

No código, é possível identificar a necessidade de autenticação por sessão através do middleware `withAuth` (há um caso especial em que se utiliza `withGetPostsAuth` que impede o acesso a postagens não publicadas).

### Bearer tokens

Bearer tokens são usados para impedir o acesso a rotas cujas finalidades são internas e técnicas, como envio de e-mails de contato. Os tokens são armazenados nas variáveis de ambiente e são enviados no cabeçalho `Authorization` da requisição. Para a checagem, utiliza-se o middleware `withTokenAuth`.

---

## Endpoints da API

### PATCH /api/admin/change-email

**Autenticação:** Por sessão.

**Descrição:** Permite ao usuário autenticado alterar seu e-mail.

#### Estrutura de requisição

```json
{
  "email": string,
  "newEmail": string,
  "newEmailConfirmation": string
}
```

#### Respostas

- **200** _OK_

```json
{
  "message": "E-mail alterado com sucesso"
}
```

- **400** _Bad Request_

```json
{
  "error": {
    [k: string]: string[]
  }
}
```

- **401** _Unauthorized_

```json
{
  "message": "Não autorizado."
}
```

- **404** _Not Found_

```json
{
  "message": "Usuário não encontrado"
}
```

- **409** _Conflict_

```json
{
  "error": {
    "newEmail": ["Email já em uso"]
  }
}
```

- **500** _Internal Server Error_

```json
{
  "message": "Ocorreu um erro."
}
```

### PATCH /api/admin/change-password

**Autenticação:** Por sessão.

**Descrição:** Permite ao usuário autenticado alterar sua senha.

#### Estrutura de requisição

```json
{
 "password": string,
 "newpassword": string,
 "newPasswordConfirmation": string
}
```

#### Respostas

- **200** _OK_

```json
{
  "message": "Senha alterada com sucesso."
}
```

- **400** _Bad Request_

```json
{
  "error": {
    [k: string]: string[]
  }
}
```

- **401** _Unauthorized_

```json
{
  "message": "Não autorizado."
}
```

- **404** _Not Found_

```json
{
  "message": "Usuário não encontrado"
}
```

- **500** _Internal Server Error_

```json
{
  "message": "Ocorreu um erro."
}
```

### CREATE /api/create-admin

**Autenticação**: Por sessão (apenas administradores podem criar novos usuários).

**Descrição**: Cria um novo usuário com a permissão de administrador no sistema.

#### Estrutura de requisição

```json
{
  "name": string,
  "role": string,
  "password": string,
  "passwordconfirmation": string
}
```

#### Respostas

- **200** _OK_

```json
{
  "message": "Admin criado com sucesso."
}
```

- **400** _Bad Request_

```json
{
  "error": {
    [k: string]: string
  }
}
```

- **401** _Unauthorized_

```json
{
  "message": "Não autorizado."
}
```

- **409** _Conflict_

```json
{
  "error": {
    "email": ["Email já em uso"]
  }
}
```

- **500** _Internal Server Error_

```json
{
  "message": "Ocorreu um erro."
}
```

### DELETE /api/admin/delete

**Autenticação**: Por sessão.

**Descrição**: Exclui usuário atualmente logado no sistema.

#### Estrutura de requisição

Sem corpo, pois o usuário é identificado por seu ID guardado e encriptografado na sessão atual.

#### Respostas

- **204** _No Content_

Sem corpo.

- **401** _Unauthorized_

```json
{
  "message": "Não autorizado."
}
```

- **500** _Internal Server Error_

```json
{
  "message": "Ocorreu um erro."
}
```

### PUT /api/admin/edit-info

**Autenticação**: Por sessão.

**Descrição**: Edita as informações que aparecem no blog do administrador atualmente autenticado.

#### Estrutura de requisição

```json
{
  "name": string,
  "role": string,
  "profilePicture": string
}
```

#### Respostas

- **200** _OK_:

```json
{
  "message": "Informações alteradas com sucesso."
}
```

- **400** _Bad Request_

```json
{
  "error": {
    [k: string]: string
  }
}
```

- **401** _Unauthorized_

```json
{
  "message": "Não autorizado."
}
```

- **404** _Not Found_

```json
{
  "message": "Perfil não encontrado"
}
```

- **500** _Internal Server Error_

```json
{
  "message": "Ocorreu um erro."
}
```

### GET /api/blog

**Autenticação**: Requer autenticação por sessão caso `published !== true`.

**Descrição**: Lista as postagens do blog, filtrando-as se inserido algum valor nas queries.

#### Estrutura de requisição

```ts
interface searchQuery {
  id: number;
  search: string;
  published: boolean;
}
```

#### Respostas

- **200** _OK_

```json
{
  "data": {
    "id": number,
    "title": string,
    "content": string, // HTML of the post
    "miniature": string, // URL of the miniature image
    "authorId": string,
    "published": boolean,
    "lastEditedAt": Date
  }[]
}
```

- **400** _Bad Request_

```json
{
  "error": {
    [k: string]: string
  }
}
```

- **401** _Unauthorized_

```json
{
  "message": "Não autorizado."
}
```

### POST /api/blog/posts

**Autenticação**: Por sessão.

**Descrição**: Cria uma nova postagem no blog.

#### Estrutura de requisição

```json
{
  "title": string,
  "content": string,
  "published": boolean,
  "miniature": string
}
```

- **201** _Created_

```json
{
  "id": number
}
```

- **400** _Bad Request_

```json
{
  "error": {
    [k: string]: string
  }
}
```

- **401** _Unauthorized_

```json
{
  "message": "Não autorizado."
}
```

- **500** _Internal Server Error_

```json
{
  "message": "Ocorreu um erro."
}
```

### PUT /api/blog/posts

**Autenticação**: Por sessão.

**Descrição**: Edita um post existente no blog.

#### Estrutura de requisição

```json
{
  "id": number,
  "title": string,
  "content": string,
  "miniature": string,
  "published": boolean
}
```

#### Respostas

- **204** _No Content_

Sem corpo.

- **400** _Bad Request_

```json
{
  "error": {
    [k: string]: string
  }
}
```

- **401** _Unauthorized_

```json
{
  "message": "Não autorizado."
}
```

- **404** _Not Found_

```json
{
  "message": "Post não encontrado"
}
```

- **500** _Internal Server Error_

```json
{
  "message": "Ocorreu um erro."
}
```

### DELETE /api/blog/posts

**Autenticação**: Por sessão.

**Descrição**: Exclui um post do blog.

#### Estrutura de requisição

```json
{
  "id": number
}
```

#### Respostas

- **204** _No Content_

Sem corpo.

- **400** _Bad Request_

```json
{
  "error": {
    [k: string]: string
  }
}
```

- **401** _Unauthorized_

```json
{
  "message": "Não autorizado."
}
```

- **404** _Not Found_

```json
{
  "message": "Post não encontrado"
}
```

- **500** _Internal Server Error_

```json
{
  "message": "Ocorreu um erro."
}
```

### POST /api/fale-conosco

**Autenticação**: Não requer autenticação.

**Descrição**: Permite que o usuário envie uma mensagem através do formulário de contato.

#### Estrutura de requisição

```json
{
  "name": string,
  "email": string,
  "phonenumber": string,
  "institution": string
}
```

#### Respostas

- **204** _No Content_

Sem corpo.

- **400** _Bad Request_

```json
{
  "error": {
    [k: string]: string
  }
}
```

- **401** _Unauthorized_

```json
{
  "message": "Não autorizado."
}
```

- **500** _Internal Server Error_

```json
{
  "message": "Ocorreu um erro."
}
```

### POST /api/login

**Autenticação**: Não requer autenticação (é o primeiro ponto de entrada para obter um token).

**Descrição**: Realiza o login do usuário com e-mail e senha.

#### Estrutura de requisição

```json
{
  "email": string,
  "password": string
}
```

#### Respostas

- **200** _OK_

```json
{
  "message": "Login realizado com sucesso"
}
```

- **400** _Bad Request_

```json
{
  "error": {
    [k: string]: string
  }
}
```

- **401** _Unauthorized_

```json
{
  "message": "Email ou senha incorretos."
}
```

- **500** _Internal Server Error_

```json
{
  "message": "Ocorreu um erro."
}
```

### POST /api/logout

**Autenticação**: Por sessão.

**Descrição**: Realiza o logout do usuário, encerrando sua sessão.

#### Estrutura de requisição

Sem corpo.

#### Respostas

- **204** _No Content_

Sem corpo.

- **401** _Unauthorized_

```json
{
  "message": "Não autorizado."
}
```

- **500** _Internal Server Error_

```json
{
  "message": "Ocorreu um erro."
}
```

### GET /api/quark-na-midia

**Autenticação**: Não requer autenticação.

**Descrição**: Acessa a lista de manchetes de notícias sobre a Quark.

#### Estrutura de requisição

```ts
interface searchQuery {
  id: number;
}
```

#### Respostas

- **200** _OK_

```json
{
  "data": {
    "id": number,
    "title": string,
    "description": string,
    "miniature": string,
    "publishingDate": Date,
    "url": string
  }[]
}
```

- **400** _Bad Request_

```json
{
  "error": {
    [k: string]: string
  }
}
```

- **401** _Unauthorized_

```json
{
  "message": "Não autorizado."
}
```

- **404** _Not Found_

```json
{
  "message": "Manchete não encontrada"
}
```

- **500** _Internal Server Error_

```json
{
  "message": "Ocorreu um erro."
}
```

## Créditos

**Front-end:** [Gabriel Vedova](https://linkedin.com/in/gabrielvedova)
**Back-end:** [Caio de Araújo](https://linkedin.com/in/caiotdearaujo)
**Documentação**: [Breno Cunha](https://www.linkedin.com/in/breno-cunha-2a49a9302?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app)
