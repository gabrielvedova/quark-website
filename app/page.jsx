import "./styles.css";
import Menu from "@/components/menu/Menu";
import Home from "@/components/home/Home";
import Diferenciais from "@/components/diferenciais/Diferenciais";
import Depoimentos from "@/components/depoimentos/Depoimentos";
import Conquistas from "@/components/conquistas/Conquistas";
import Perguntas from "@/components/perguntas/Perguntas";
import Blog from "@/components/blog/Blog";
import Patrocinio from "@/components/patrocinio/Patrocinio";

export default function App() {
  return (
    <div className="main">
      <Menu />
      <div className="containerBoss">
        <Home />
        <Diferenciais />
        <Depoimentos />
        <Perguntas />
        <Conquistas />
        <Blog />
        <Patrocinio />
      </div>
      <footer>Copyright © 2022 Happen. Todos os direitos reservados</footer>
    </div>
  );
}
