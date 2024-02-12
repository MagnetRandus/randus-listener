require("module-alias/register");
import dotenv from "dotenv";
import { checkdotenv } from "./api/utils/environment";
import { CreateListener } from "./api/start-listening";
import { join } from "path";

const appConf = require(join(__dirname, "config.json")) as OCONF;

try {
  dotenv.config();
  ["apikey"].forEach((v: string) => {
    checkdotenv(process.env, v);
  });

  CreateListener(appConf);
} catch (err) {
  if (err instanceof Error) {
    console.log(`Oops, something crashed - here's some more info:`);
    console.log(err.message);
  } else {
    console.log(`Something weird happened - sorry!`);
    console.log(JSON.stringify(err));
  }
}
