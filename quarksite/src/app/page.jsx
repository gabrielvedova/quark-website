import styles from "../styles/App.module.css";
import Menu from "../components/Menu";
import Home from "../components/Home";
import ComoFunciona from "../components/Funcionalidade";
import ConhecaQuark from "../components/Conheca";
import Diferenciais from "../components/Diferenciais";
import Depoimentos from "../components/Depoimentos";
import Conquistas from "../components/Conquistas";
import Perguntas from "../components/Perguntas";
import Blog from "../components/Blog";
import Time from "../components/Time";
import Patrocinio from "../components/Patrocinio";

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
