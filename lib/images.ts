export const images = {
  diferentials: "Diferenciais.png",
  favicon: "favicon-16x16.png",
  home1: "Home1.png",
  home2: "Home2.png",
  home3: "Home3.png",
  logo: "logoQuark.png",
  numbers1: "Numeros1.png",
  numbers2: "Numeros2.png",
  numbers3: "Numeros3.png",
  cesar: "parceiros/parceiroCESAR.png",
  embarque: "parceiros/parceiroEmbarque.png",
  governo: "parceiros/parceiroGoverno.png",
  ifpe: "parceiros/parceiroIFPECIENCIA.png",
  ifsertaope: "parceiros/parceiroIFSERTAOPE.png",
  ijcpm: "parceiros/parceiroIJCPM.png",
  portoDigital: "parceiros/parceiroPortoDigital.png",
  redeCidada: "parceiros/parceiroREDECIDADA.png",
  sebraepe: "parceiros/parceiroSebraePE.png",
  senac: "parceiros/parceiroSenac.png",
  softex: "parceiros/parceiroSOFTEX.png",
  uninovo: "parceiros/parceiroUNINOVO.png",
  amcham: "media/amcham.png",
  bomDiaPE: "media/bom-dia-pe.png",
  distrito: "media/distrito.png",
  top100: "media/happen-top100.png",
  unicap: "media/unicap.png",
};

export default function getImageUrl(imageKey: keyof typeof images) {
  return `https://cdn.plataformaquark.com/public-assets/site/${images[imageKey]}`;
}
