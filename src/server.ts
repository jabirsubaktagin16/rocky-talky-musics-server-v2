import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import config from "./config";

process.on("uncaughtException", (error) => {
  console.error(error);
  process.exit(1);
});

let server: Server;

async function bootstrap() {
  try {
    await mongoose.connect(config.database_url as string);
    console.log("Database connection established");

    app.listen(config.port, () => {
      console.log(`Application listening on port ${config.port}`);
    });
  } catch (err) {
    console.error("Failed to connect Database");
  }

  process.on("unhandledRejection", (error) => {
    console.error(
      "Unhandled rejection is detected, we are closing the server......"
    );
    if (server) {
      server.close(() => {
        console.error(error);
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });
}

bootstrap();

process.on("SIGTERM", () => {
  console.log("SIGTERM is received");
  if (server) {
    server.close();
  }
});
