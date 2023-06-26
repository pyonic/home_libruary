import { Injectable, NestMiddleware } from "@nestjs/common";
import { CustomLoggerService } from "./logger.service";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    constructor (
        private readonly loggerService: CustomLoggerService
    ) {}

    use(req: any, res: any, next: (error?: any) => void) {
        
        this.loggerService.logRequest(req, res);

        next();
    }
}