export function checkdotenv<T, K extends keyof T>(obj: Partial<T>, prop: K, msg?: string) {
  if (typeof obj[prop] === "undefined" || obj[prop] === null) {
    throw new Error(msg || `Missing Environment Variable: "${String(prop)}"`);
  } else {
    return obj[prop] as T[K];
  }
}

export interface IProcessEnv {
  apikey: string;
  port: string;
  SysSettings: OCONF;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends IProcessEnv {}
  }
}
