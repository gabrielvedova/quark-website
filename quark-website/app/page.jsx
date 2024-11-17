"use client";
import "./app.css";
import Menu from "@/components/main-page/components/menu/Menu";
import MainPage from "@/components/main-page/MainPage";

function App() {
  return (
    <div className="main">
      <Menu />
      <div className="containerBoss">
        <MainPage />
      </div>
      <footer>Copyright © 2022 Happen. Todos os direitos reservados</footer>
    </div>
  );
}

export default App;
