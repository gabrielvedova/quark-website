import styles from '../styles/App.module.css'
import Menu from '../components/menu'
import Home from '../components/home'
import ComoFunciona from '../components/funcionalidade'
import ConhecaQuark from '../components/conheca'
import Diferenciais from '../components/diferenciais'
import Depoimentos from '../components/depoimentos'
import Conquistas from '../components/conquistas'
import Perguntas from '../components/perguntas'
import Blog from '../components/blog'
import Time from '../components/time'
import Patrocinios from '../components/patrocionios'

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
        <Patrocinios />
      </div>
    </div>
  )
}

export default App