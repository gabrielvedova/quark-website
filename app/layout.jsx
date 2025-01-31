import "./styles.css";

export const metadata = {
  title:
    "Quark - Plataforma de ensino de habilidades comportamentais para jovens",
};

export default function Layout({ children }) {
  return (
    <html lang="pt-br">
      <head>
        {/* TODO add favicon url */}
        <link rel="icon" href={""} type="image/x-icon" />
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
