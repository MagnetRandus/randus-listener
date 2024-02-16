// Import the required modules
import express, { Request, Response, NextFunction } from "express";
import swaggerUI from "swagger-ui-express";
import cors from "cors";
import https from "https";
import fs from "fs";
import path from "path";
import { talkagpt } from "./bridge/gap";
import { ITalk } from "./types/talk";

function httpHeaderDefaults(res: Response): void {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("X-Powered-By", "Magnet-Randus");
}

const [auth, log] = [
  function (req: Request, res: Response, next: NextFunction) {
    //auth
    console.log(`AUTHING`);
    next();
  },
  function (req: Request, res: Response, next: NextFunction) {
    //log
    console.log(`LOGGING`);
    next();
  }
];

function collectBody(req: Request): Promise<ITalk> {
  return new Promise<ITalk>((resolve, reject) => {
    let dataChunks: Uint8Array[] = [];

    req.on("data", (chunk: Uint8Array) => {
      dataChunks.push(chunk);
    });

    req.on("end", () => {
      const body = Buffer.concat(dataChunks).toString();

      if (body) {
        console.log(`got called`);
        resolve(JSON.parse(body));
      }

      reject();
    });
  });
}

export function CreateListener(AppConf: OCONF, swagDoc: swaggerUI.JsonObject): void {
  try {
    const expApp = express();
    // Create new express app
    const corsOptions: cors.CorsOptions = {
      origin: ["https://atarendt.sharepoint.com", "https://localhost"]
    };
    expApp.use(cors(corsOptions));
    // expApp.use(bodyParser);
    expApp.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swagDoc));

    const privateKey = fs.readFileSync(path.join(__dirname, "rushstack-serve.key"), "utf8");
    const certificate = fs.readFileSync(path.join(__dirname, "rushstack-serve.pem"), "utf8");
    const credentials = { key: privateKey, cert: certificate };

    const server = https.createServer(credentials, expApp);

    server.listen(AppConf["http-info"]["port-number"], () => {
      console.log(`HTTPS Server running at https://0.0.0.0:${expApp.get("port")}`);
    });

    expApp.get("/time", [auth, log], (req: Request, res: Response) => {
      httpHeaderDefaults(res);
      if (req.accepts([`html`, "text/plain"])) {
        //Get all the supported time zones:  Intl.supportedValuesOf('timeZone')

        const d = new Date(new Date().toLocaleString("en-US", { timeZone: "Africa/Johannesburg" }));

        const [h, m, s] = [d.getHours(), d.getMinutes(), d.getSeconds()].map((g) => g.toString().padStart(2, "0"));

        res.send(`<html><head></head><body><div>Express Yourself:  ${h}:${m}:${s}</div></body></html>`);
      } else {
        res.status(400);
        res.send(`Sorry but I wasn't expecting the info to be: ${JSON.stringify(req.accepts())}`);
      }
    });

    expApp.post(`/ask`, [auth, log], (req: Request, res: Response) => {
      httpHeaderDefaults(res);
      switch (req.route.path) {
        case "/ask":
          try {
            collectBody(req)
              .then(async (reqsBody) => {
                const q = req.query as { model: string };

                const antwoord = await talkagpt(reqsBody, q.model);

                res.status(200).json(antwoord.choices[0].message);
              })
              .catch((err) => {
                throw new Error();
              });
          } catch (err) {
            err instanceof Error && err.message ? res.status(404).send(err.message) : res.status(404).send(`You're talking gibberish!`);
          }

          // talkagpt(process.env.apikey, `This is a test message`)
          //   .then((resolve) => {
          //     res.json(resolve);
          //   })
          //   .catch((reject) => {
          //     throw new Error(reject);
          //   });
          break;

        default:
          res.send(`You talk gibberish`);
          break;
      }
    });

    process.on("uncaughtException", (error) => {
      console.error("Unhandled Exception:", error);
      server.close(() => {
        process.exit(1); // Exit the process
      });
    });

    process.on("SIGINT", () => {
      console.log("Received SIGINT. Closing server...");
      server.close(() => {
        console.log("Server closed.");
        process.exit(0); // Exit the process
      });
    });
  } catch (error) {
    throw error;
  }
}
