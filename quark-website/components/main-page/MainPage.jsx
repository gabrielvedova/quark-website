"use client";
import Home from "@/components/main-page/components/home/Home";
import ComoFunciona from "@/components/main-page/components/como-funciona/ComoFunciona";
import ConhecaQuark from "@/components/main-page/components/conheca/Conheca";
import Diferenciais from "@/components/main-page/components/diferenciais/Diferenciais";
import Depoimentos from "@/components/main-page/components/depoimentos/Depoimentos";
import Conquistas from "@/components/main-page/components/conquistas/Conquistas";
import Perguntas from "@/components/main-page/components/perguntas/Perguntas";
import Blog from "@/components/main-page/components/blog/Blog";
import Time from "@/components/main-page/components/time/Time";
import Patrocinio from "@/components/main-page/components/patrocinio/Patrocinio";

export default function MainPage() {
  return (
    <>
      <Home />
      <ComoFunciona />
      <ConhecaQuark />
      <Diferenciais />
      <Depoimentos />
      <Perguntas />
      <Conquistas />
      <Blog />
      <Time />
      <Patrocinio />
    </>
  );
}
