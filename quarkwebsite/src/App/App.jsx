import './App.css'
import Menu from '../Menu/menu'
import Home from '../Home/home'
import ComoFunciona from '../Funcionalidade/Funcionalidade'
import ConhecaQuark from '../Conheca/Conheca'
import Diferenciais from '../Diferenciais/Diferenciais'
import Depoimentos from '../Depoimentos/Depoimentos'
import Conquistas from '../Conquistas/Conquistas'
import Perguntas from '../Perguntas/Perguntas'
import Blog from '../Blog/Blog'
import Time from '../Time/Time'
import Patrocinios from '../Patrocionios/Patrocionios'

function App() {

  return (
    <div className='main'>
      <Menu />
      <div className='containerBoss'>
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
