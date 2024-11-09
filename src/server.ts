import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import config from "./app/config";

let server: Server;

async function main() {
  try {
    await mongoose.connect(config.database_url as string);
    server = app.listen(config.port, () => {
      console.log(
        `Sports facility booking server is running on port ${config.port}`
      );
    });
  } catch (erorr) {
    console.log(erorr);
  }
}
main();

process.on("unhandledRejection", (error) => {
  console.log("Unhandled Rejection is detected 😒. Shooting down...", error);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("uncaughtException", () => {
  console.log("Unhandled Exception is detected 😒. Shooting down...");

  process.exit(1);
});
