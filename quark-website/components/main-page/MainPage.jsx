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

export default function MainPage() {
  return (
    <>
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
    </>
  );
}
