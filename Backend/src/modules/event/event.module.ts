import { Module } from '@nestjs/common';
import { EventPublisherService } from './event-publisher.service';
import { EventListenerService } from './event-listener.service';

@Module({
  imports: [],
  providers: [EventPublisherService, EventListenerService],
  exports: [EventPublisherService],
})
export class EventModule {}
