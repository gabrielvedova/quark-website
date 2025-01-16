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

- **Frontend**: React e Next.Js.
- **Backend**: Node.js e Next.js.
- **Banco de Dados**: PostgreSQL e Prisma ORM.
- **Serviços Externos**: AWS SES (email) e AWS S3 (armazenamento de imagem)

---

## Estrutura do Projeto

```txt
quark/
├── prisma/     # Configuração do Prisma ORM (modelos, migrações, etc.)
├── public/     # Arquivos públicos (imagens, favicon, etc.)
├── components/ # Componentes reutilizáveis (botões, cabeçalhos, formulários, etc.)
├── lib/        # Funções e bibliotecas reutilizáveis, como helpers, utilitários
├── app/        # Lógica principal da aplicação, incluindo API
│   └── api/    # Endpoints da API
├── .env        # Variáveis de ambiente (não versionadas)
└── README.md   # Documentação principal do projeto (você está aqui)
```

---

## Como Rodar o Projeto Localmente

### Pré-requisitos

Antes de começar, certifique-se de ter as seguintes dependências instaladas:

- **npm** ou **yarn** (gerenciador de pacotes)

### Passo a Passo

1 - Clone o repositório:

```bash
git clone https://github.com/gabrielvedova/quark-website.git
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
CONTACT_RECIPIENT_ADDRESS # endereço de email do destinatário do email de contato
DATABASE_URL              # URL de conexão com o banco de dados
SESSION_SECRET            # segredo para encriptar as sessões
S3_BUCKET_NAME            # nome do bucket do S3
```

---

## Como Fazer Deploy no Elastic Beanstalk

### Pré-requisitos

Antes de começar, certifique-se de ter as seguintes dependências instaladas:

- **npm** ou **yarn** (gerenciador de pacotes)
- **AWS CLI** (com credenciais configuradas)
- **EB CLI** (Elastic Beanstalk Command Line Interface)

### Passo a Passo

1 - Clone o repositório:

```bash
git clone https://github.com/gabrielvedova/quark-website.git
```

2 - Acesse o diretório do projeto: 

```bash
cd quark-website/
```

3 - Instale os pacotes:

```bash
npm install # ou yarn
```

4 - Faça build da aplicação:

```bash
npm run build
```

5 - Crie um arquivo `.ebignore` com o seguinte conteúdo:

```txt
node_modules
```

6 - Faça login na AWS:

```bash
aws configure
```

7 - Inicialize o Elastic Beanstalk:

```bash
eb init
```

8 - Crie um ambiente:

```bash
eb create
```

9 - Faça deploy da aplicação:

```bash
eb deploy
```

10 - Configure as váriáveis de ambiente na AWS:

```env
CONTACT_RECIPIENT_ADDRESS # endereço de email do destinatário do email de contato
DATABASE_URL              # URL de conexão com o banco de dados
SESSION_SECRET            # segredo para encriptar as sessões
S3_BUCKET_NAME            # nome do bucket do S3
```

---

## Painel de Administração

O painel de administração é uma interface web que permite aos administradores do sistema gerenciar conteúdos, usuários e configurações do site. Ele é acessado através da rota `/admin` e requer autenticação para ser acessado.

## Autenticação

### Sessões

As sessões são guardadas no banco de dados e são encriptografadas com um segredo definido nas variáveis de ambiente. Elas são usadas para autenticar usuários e manter a sessão ativa enquanto o usuário estiver logado. As sessões são encerradas quando o usuário faz logout ou quando o token expira. As sessões armazenam o ID do usuário e a data de expiração do token.

Este meio de autenticação é considerado o principal, sua finalidade é proteger páginas e rotas que só devem ser acessadas pelos administradores do sistema.

O cookie responsável por armazenar a sessão é seguro e possui as seguintes configurações:

- **httpOnly**: O cookie só pode ser acessado pelo servidor.
- **secure**: O cookie só é enviado em conexões seguras (HTTPS).
- **sameSite**: O cookie só é enviado se a requisição for do mesmo site.

Seu nome é `session` e seu valor é o token de sessão encriptografado.

No código, é possível identificar a necessidade de autenticação por sessão através do middleware `withAuth`.

## Créditos

- **Front-end:** [Gabriel Vedova](https://linkedin.com/in/gabrielvedova)
- **Back-end:** [Caio de Araújo](https://linkedin.com/in/caiotdearaujo)
- **Documentação**: [Breno Cunha](https://www.linkedin.com/in/breno-cunha-2a49a9302?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app)
