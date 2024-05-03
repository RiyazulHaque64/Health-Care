import app from "./app";
import config from "./config";

const port = config.port || 9000;

async function main() {
  const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

main();
