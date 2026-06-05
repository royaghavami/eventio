import {
  Controller,
  Get,
  ServiceUnavailableException,
} from '@nestjs/common';
import { HealthService } from './health.service';

@Controller()
export class RootController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  root() {
    if (!this.healthService.isReady()) {
      throw new ServiceUnavailableException({ status: 'not_ready' });
    }

    return { status: 'ok' };
  }
}
