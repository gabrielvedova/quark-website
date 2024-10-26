import './App.css'
import Menu from '../Menu/menu'
import Home from '../Topics/Home/home'
import ComoFunciona from '../Topics/Funcionalidade/Funcionalidade'
import ConhecaQuark from '../Topics/Conheca/Conheca'
import Diferenciais from '../Topics/Diferenciais/Diferenciais'
import Depoimentos from '../Topics/Depoimentos/Depoimentos'
import Conquistas from '../Topics/Conquistas/Conquistas'
import Perguntas from '../Topics/Perguntas/Perguntas'
import Blog from '../Topics/Blog/Blog'
import Time from '../Topics/Time/Time'
import Patrocinios from '../Topics/Patrocionios/Patrocionios'

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
