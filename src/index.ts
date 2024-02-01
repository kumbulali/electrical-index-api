import app from './app';
import config from './config/default.variables.config';
import dataSource from "./config/datasource.config";

dataSource
  .initialize()
  .then(() => {
    console.log("Database connection established!");
  })
  .catch((err: Error) => console.log(err));

const PORT = config.server.port;
const HOSTNAME = config.server.hostname;

app.listen(PORT, () =>
  console.log(`Server is running on ${HOSTNAME}:${PORT}`)
);