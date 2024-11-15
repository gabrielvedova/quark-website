"use client";
import "./app.css";
import Menu from "@/components/menu/Menu";
import MainPage from "@/components/main-page/MainPage";

function App() {
  return (
    <div className="main">
      <Menu />
      <div className="containerBoss">
        <MainPage />
      </div>
    </div>
  );
}

export default App;
