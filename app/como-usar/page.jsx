import HowUse from "@/components/howUse-page/HowUse";
import Menu from "@/components/howUse-page/components/menu/Menu";
import "./como-usar.css";

export default function Page() {
  return (
    <div className="main">
      <Menu />
      <div className="containerBoss">
        <HowUse />
      </div>
      <footer>Copyright © 2022 Happen. Todos os direitos reservados</footer>
    </div>
  );
}
