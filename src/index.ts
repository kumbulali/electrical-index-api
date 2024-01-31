import app from './app';
import config from './config/config';
import dataSource from "./config/dataSource";

dataSource
  .initialize()
  .then(() => {
    console.log("Database connection established!");
  })
  .catch((error: Error) => console.log(error));

const PORT = config.server.port;
const HOSTNAME = config.server.hostname;

app.listen(PORT, () =>
  console.log(`Server is running on ${HOSTNAME}:${PORT}`)
);