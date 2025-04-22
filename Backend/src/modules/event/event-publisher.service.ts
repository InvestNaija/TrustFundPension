import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ISendEmailConfig } from '../../shared/email/types';
import { EVENT } from '../../core/constants';

@Injectable()
export class EventPublisherService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  async publishSendEmail(data: ISendEmailConfig) {
    return this.eventEmitter.emit(EVENT.SEND_EMAIL, data);
  }

  // Easy to add more typed event emission methods
}
