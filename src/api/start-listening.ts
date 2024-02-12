// Import the required modules
import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";

export function CreateListener(AppConf: OCONF) {
  try {
    // Create new express app
    const expApp = express();

    // Add the middleware to the app
    expApp.use(bodyParser.json());
    expApp.use(cors());
    expApp.use(express.json());

    // Using multiple handlers (middleware)
    expApp.use((req, res, next) => {
      console.log(`${req.method} ${req.originalUrl}`);
      const startTime = new Date().getTime();

      // calling next middleware
      next();

      // Logging request duration after response has been sent
      res.on("finish", () => {
        const elapsedTime = new Date().getTime() - startTime;
        console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${elapsedTime}ms`);
      });
    });

    // Handle POST request to '/submit-data'
    expApp.post("/submit-data", (req: Request, res: Response) => {
      const { method, url } = req;
      console.log(req.body); // Log data to the console
      // Echo back the received data with a custom message
      res.status(200).json({
        message: "Data received successfully.",
        receivedData: req.body
      });
    });

    // Define the routes
    expApp.get("/", (req, res) => {
      if (req.headers.accept && req.headers.accept.includes("application/json")) {
        const o = { you: "data" };
        res.setHeader("Content-Type", "application/json");
        res.setHeader("X-Powered-By", "Magnet-Randus");
        res.json(o); // Send JSON response
      } else {
        res.status(406).send(`We only understand JSON here`); // Send 406 Not Acceptable status
      }
    });

    // Middleware for parsing JSON
    // app.use(express.json());

    // app.post("/api/users", (req, res) => {
    //   // Handle the POST request (e.g., save user data to a database)
    //   res.send("User created successfully!");
    // });

    // Custom middleware function to log request details

    // Use the config file for the settings of the app

    expApp.set("port", AppConf["http-info"]["port-number"]);

    // Start the server
    expApp.listen(expApp.get("port"), () => {
      console.log("TypeScript app is running at http://0.0.0.0:%d", expApp.get("port"));
    });
  } catch (error) {
    throw error;
  }
}
