import morgan from "morgan";
import path from "path";
import * as fs from 'fs';

const logDirectory = path.join(__dirname, '..', '..', 'logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = fs.createWriteStream(path.join(logDirectory, `request_log_${new Date().toISOString().slice(0, 10)}.log`), { flags: 'a' });

const requestLogger = morgan('combined', { stream: accessLogStream });

export default requestLogger;