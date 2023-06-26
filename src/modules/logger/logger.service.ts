import { Injectable, LoggerService } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class CustomLoggerService implements LoggerService {
  private readonly levels_transformer: any = {
    0: 'log',
    1: 'error',
    2: 'warn',
    3: 'debug',
    4: 'verbose',
  };

  async log(message: any) {
    await this.logger(this.levels_transformer[0], message);
  }

  async error(message: any) {
    await this.logger(this.levels_transformer[1], message);
  }

  async warn(message: any) {
    await this.logger(this.levels_transformer[2], message);
  }

  async debug?(message: any) {
    await this.logger(this.levels_transformer[3], message);
  }

  async verbose?(message: any) {
    await this.logger(this.levels_transformer[4], message);
  }

  async logger(level: string, data: any) {
    let logLevel = 0;
    let color = '\x1b[37m';
    switch (level) {
      case 'error':
        logLevel = 1;
        color = '\x1b[31m';
        break;
      case 'warn':
        logLevel = 2;
        color = '\x1b[33m';
        break;
      case 'log':
        logLevel = 3;
        color = '\x1b[32m';
        break;
      case 'verbose':
        logLevel = 4;
        color = '\x1b[36m';
        break;
      case 'debug':
        logLevel = 5;
        color = '\x1b[37m';
        break;

      default:
        break;
    }

    console.log(logLevel, +process.env.LOG_LEVEL);

    if (logLevel > +process.env.LOG_LEVEL) return;

    console.log(logLevel, +process.env.LOG_LEVEL);

    if (typeof data !== 'string') {
      data = JSON.stringify(data);
    }

    const log = `[${level.toUpperCase()}] ${data} \n`;

    console.log(color, `${log}`, '\x1b[0m');

    await this.saveLog(log, { error: logLevel === 1 });
  }

  async logRequest(req: any, res: any, meta: any = { error: false }) {
    const now: Date = new Date();
    let logObj: any = {};

    if (meta.error) {
      logObj = {
        method: req.method,
        url: req.url,
        ip: req.ip,
        details: meta.details,
        headers: req.headers,
        query: req.query,
        body: req.body,
        response_status: res.statusCode,
        time: now,
      };

      const log: string = JSON.stringify(logObj) + '\n-----------------\n';

      await this.saveLog(log, meta);

      process.stdout.write(log);
    } else {
      const start: number = Date.now();

      res.on('finish', async () => {
        const finish: number = Date.now();

        const timeout: number = new Date(finish - start).getMilliseconds();

        timeout.toFixed(3);

        const statusCode: number = res.statusCode;

        logObj = {
          method: req.method,
          url: req.url,
          ip: req.ip,
          headers: req.headers,
          query: req.query,
          body: req.body,
          response_status: statusCode,
          timeout: `${timeout}ms`,
          time: now,
        };

        const log: string = JSON.stringify(logObj) + '\n-----------------\n';

        await this.saveLog(log, meta);

        process.stdout.write(log);
      });
    }
  }

  async createFolder(path) {
    try {
      await fs.access(path);
    } catch {
      await fs.mkdir(path);
    }
  }

  async saveLog(data, meta = { error: false }) {
    const { error } = meta;

    let logFile: string = null;

    const logsFolder: string = path.resolve('./server_logs');
    const errorLogsFolder: string = path.resolve('./error_logs');

    const destination: string = error ? errorLogsFolder : logsFolder;

    const logRotationSize: number = +process.env.MAX_LOG_SIZE;

    await this.createFolder(destination);

    const files: Array<string> = await fs.readdir(destination);

    const fileStats: Array<any> = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const filePath = path.join(destination, file);
      const stats = await fs.stat(filePath);
      fileStats.push({ file, size: stats.size });
    }

    const sortedFiles: Array<any> = fileStats.sort(
      (a: any, b: any) => a.size - b.size,
    );

    if (sortedFiles.length) {
      const freshLogFile: any = sortedFiles[0];

      if (logRotationSize * 1024 < freshLogFile.size) {
        const fileName = `logs_${Date.now()}.log`;
        logFile = path.join(destination, fileName);
      } else {
        logFile = path.join(destination, freshLogFile.file);
      }
    } else {
      const fileName = `logs_${Date.now()}.log`;
      logFile = path.join(destination, fileName);
    }

    await fs.appendFile(logFile, data);
  }

  async catchUnhandledRejections() {
    await this.log('unhandledRejection exception handled');

    process.on('unhandledRejection', async (reason: any) => {
      await this.error(`Unhandled rejection detected: ${reason.message}`);
      if (+process.env.KILL_ON_UNHANDLED === 1) {
        process.exit(0);
      }
    });
  }

  async catchUncaughtExceptions() {
    await this.log('uncaughtException exception handled');

    process.on('uncaughtException', async (error: Error) => {
      await this.error(
        `Unhandled error detected: ${error.stack || error.message}`,
      );
      if (+process.env.KILL_ON_UNHANDLED === 1) {
        process.exit(0);
      }
    });
  }
}
