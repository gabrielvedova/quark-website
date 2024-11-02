import styles from "./app.module.css";
import Menu from "@/app/components/menu/Menu";
import Home from "@/app/components/home/Home";
import ComoFunciona from "@/app/components/como-funciona/ComoFunciona";
import ConhecaQuark from "@/app/components/conheca/Conheca";
import Diferenciais from "@/app/components/diferenciais/Diferenciais";
import Depoimentos from "@/app/components/depoimentos/Depoimentos";
import Conquistas from "@/app/components/conquistas/Conquistas";
import Perguntas from "@/app/components/perguntas/Perguntas";
import Blog from "@/app/components/blog/Blog";
import Time from "@/app/components/time/Time";
import Patrocinio from "@/app/components/patrocinio/Patrocinio";

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
