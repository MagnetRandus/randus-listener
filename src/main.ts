require("module-alias/register");
import dotenv from "dotenv";
import { checkdotenv } from "./api/utils/environment";
import { CreateListener } from "./api/start-listening";
import { join } from "path";
import yml from "yamljs";
import { talkagpt } from "./api/bridge/gap";

const appConf = require(join(__dirname, "config.json")) as OCONF;
const swagDoc = yml.load(`${__dirname}/api/klaas.yml`);

try {
  dotenv.config();
  ["apikey"].forEach((v: string) => {
    checkdotenv(process.env, v);
  });

  swagDoc ? CreateListener(appConf, swagDoc) : console.log("no swag file");

  talkagpt(process.env.apikey);
} catch (err) {
  if (err instanceof Error) {
    console.log(`Oops, something crashed - here's some more info:`);
    console.log(err.message);
  } else {
    console.log(`Something weird happened - sorry!`);
    console.log(JSON.stringify(err));
  }
}
