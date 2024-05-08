import app from "./app";
import config from "./config";

const port = config.port || 9000;

async function main() {
  const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
  process.on("uncaughtException", (error) => {
    console.log(error);
    if (server) {
      server.close(() => {
        console.log("Server closed!");
      });
    }
    process.exit(1);
  });
  process.on("unhandledRejection", (error) => {
    console.log(error);
    if (server) {
      server.close(() => {
        console.log("Server closed!");
      });
    }
    process.exit(1);
  });
}

main();
