import { Injectable } from '@nestjs/common';
import { EventService } from '@/event/event.service';
import { EventStatus } from '@/common/enums';

@Injectable()
export class AdminService {
  constructor(private readonly eventService: EventService) {}

  listEvents(status?: EventStatus) {
    return this.eventService.findByStatus(
      status ?? EventStatus.PENDING_REVIEW,
    );
  }

  approveEvent(id: number) {
    return this.eventService.setStatus(id, EventStatus.PUBLISHED);
  }

  rejectEvent(id: number) {
    return this.eventService.setStatus(id, EventStatus.REJECTED);
  }
}
