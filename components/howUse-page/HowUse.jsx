import Menu from "@/components/howUse-page/components/menu/Menu";
import Component1 from "@/components/howUse-page/components/component1/Component1";
import Component2 from "@/components/howUse-page/components/component2/Component2";
import Component3 from "@/components/howUse-page/components/component3/Component3";
import Component4 from "@/components/howUse-page/components/component4/Component4";
import Component5 from "@/components/howUse-page/components/component5/Component5";
import Component6 from "@/components/howUse-page/components/component6/Component6";
import Component7 from "@/components/howUse-page/components/component7/Component7";
import styles from "./HowUse.module.css";

export default function HowUse() {
  return (
    <div className={styles.Container}>
      <Component1 />
      <Component2 />
      <Component3 />
      <Component4 />
      <Component5 />
      <Component6 />
      <Component7 />
    </div>
  );
}
