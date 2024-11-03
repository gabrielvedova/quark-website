import styles from "./app.module.css";
import Menu from "@/components/menu/Menu";
import Home from "@/components/home/Home";
import ComoFunciona from "@/components/como-funciona/ComoFunciona";
import ConhecaQuark from "@/components/conheca/Conheca";
import Diferenciais from "@/components/diferenciais/Diferenciais";
import Depoimentos from "@/components/depoimentos/Depoimentos";
import Conquistas from "@/components/conquistas/Conquistas";
import Perguntas from "@/components/perguntas/Perguntas";
import Blog from "@/components/blog/Blog";
import Time from "@/components/time/Time";
import Patrocinio from "@/components/patrocinio/Patrocinio";

function App() {
  return (
    <div className={styles.main}>
      <Menu />
      <div className={styles.containerBoss}>
        <Home />
        <ComoFunciona />
        <ConhecaQuark />
        <Diferenciais />
        <Depoimentos />
        <Conquistas />
        <Perguntas />
        <Blog />
        <Time />
        <Patrocinio />
      </div>
    </div>
  );
}

export default App;
