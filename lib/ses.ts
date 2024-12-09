import AWS from "aws-sdk";

function sesSingleton() {
  return new AWS.SES();
}

declare const globalThis: {
  sesGlobal: ReturnType<typeof sesSingleton>;
} & typeof global;

/**
 * A singleton instance of SES.
 */
const ses = globalThis.sesGlobal || sesSingleton();

export default ses;

if (process.env.NODE_ENV !== "production") globalThis.sesGlobal = ses;
