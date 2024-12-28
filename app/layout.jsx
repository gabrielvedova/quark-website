import "./styles.css";
import favicon from "@/public/favicon-16x16.png";

export const metadata = {
  title: "Quark",
};

const RootLayout = ({ children }) => {
  return (
    <html lang="pt-br">
      <head>
        <link rel="icon" href={favicon.src} type="image/x-icon" />
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  );
};

export default RootLayout;
