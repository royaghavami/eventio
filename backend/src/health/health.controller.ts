import {
  Controller,
  Get,
  ServiceUnavailableException,
} from '@nestjs/common';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('live')
  live() {
    return { status: 'ok' };
  }

  @Get('ready')
  ready() {
    if (!this.healthService.isReady()) {
      throw new ServiceUnavailableException({ status: 'not_ready' });
    }

    return { status: 'ok' };
  }
}
