import { SES } from "@aws-sdk/client-ses";

function sesSingleton() {
  return new SES();
}

declare const globalThis: {
  sesGlobal: ReturnType<typeof sesSingleton>;
} & typeof global;

const sesClient = globalThis.sesGlobal || sesSingleton();

export default sesClient;

if (process.env.NODE_ENV !== "production") globalThis.sesGlobal = sesClient;
