import { Controller, Get } from '@nestjs/common';
import { appConfig } from '../../config/app.config';

@Controller('health')
export class HealthController {
  @Get()
  getHealth() {
    return {
      status: 'ok',
      service: appConfig.serviceName,
    };
  }
}
