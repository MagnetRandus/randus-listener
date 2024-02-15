// Import the required modules
import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";

export function CreateListener(AppConf: OCONF) {
  try {
    // Create new express app
    const expApp = express();

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

    expApp.get("/", [auth, log], (req: Request, res: Response, next: NextFunction) => {
      if (req.accepts([`html`, "text/plain"])) {
        //Get all the supported time zones:  Intl.supportedValuesOf('timeZone')

        const d = new Date(new Date().toLocaleString("en-US", { timeZone: "Africa/Johannesburg" }));

        const [h, m, s] = [d.getHours(), d.getMinutes(), d.getSeconds()].map((g) => g.toString().padStart(2, "0"));

        res.send(`${h}:${m}:${s}`);
      } else {
        res.status(400);
      }
    });

    expApp.set("port", AppConf["http-info"]["port-number"]);
    expApp.listen(expApp.get("port"), () => {
      console.log("TypeScript app is running at http://0.0.0.0:%d", expApp.get("port"));
    });
  } catch (error) {
    throw error;
  }
}
