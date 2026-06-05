import { Injectable, OnApplicationBootstrap } from '@nestjs/common';

@Injectable()
export class HealthService implements OnApplicationBootstrap {
  private ready = false;

  onApplicationBootstrap() {
    this.ready = true;
  }

  isReady() {
    return this.ready;
  }
}
