"use client";
import Home from "@/components/main-page/components/home/Home";
import Diferenciais from "@/components/main-page/components/diferenciais/Diferenciais";
import Depoimentos from "@/components/main-page/components/depoimentos/Depoimentos";
import Conquistas from "@/components/main-page/components/conquistas/Conquistas";
import Perguntas from "@/components/main-page/components/perguntas/Perguntas";
import Blog from "@/components/main-page/components/blog/Blog";
import Patrocinio from "@/components/main-page/components/patrocinio/Patrocinio";

export default function MainPage() {
  return (
    <>
      <Home />
      <Diferenciais />
      <Depoimentos />
      <Perguntas />
      <Conquistas />
      <Blog />
      <Patrocinio />
    </>
  );
}
