import "../styles/layout.css";

export const metadata = {
  title: "Quark",
};

const RootLayout = ({ children }) => {
  return (
    <html lang="pt-br">
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  );
};

export default RootLayout;
