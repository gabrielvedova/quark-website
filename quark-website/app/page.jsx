import "./app.css";
import Menu from "@/components/menu/Menu";
import MainPage from "@/app/mainPage/MainPage";

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
