import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from 'typeorm';
import { Injectable } from '@nestjs/common';
import { AuditService } from './audit.service';
import { requestContext } from '../../request-context';

@Injectable()
@EventSubscriber()
export class AuditSubscriber implements EntitySubscriberInterface {
  constructor(
    private readonly dataSource: DataSource,
    private readonly auditService: AuditService,
  ) {
    this.dataSource.subscribers.push(this);
  }

  async afterInsert(event: InsertEvent<any>): Promise<void> {
    if (this.shouldSkipAudit()) return;
    await this.auditService.create({
      userId: this.getUserIdFromContext(),
      entity: event.metadata.tableName,
      action: 'CREATE',
    });
  }

  async afterUpdate(event: UpdateEvent<any>): Promise<void> {
    if (this.shouldSkipAudit()) return;
    await this.auditService.create({
      userId: this.getUserIdFromContext(),
      entity: event.metadata.tableName,
      action: 'UPDATE',
      before: event.databaseEntity,
    });
  }

  async afterRemove(event: RemoveEvent<any>): Promise<void> {
    if (this.shouldSkipAudit()) return;
    await this.auditService.create({
      userId: this.getUserIdFromContext(),
      entity: event.metadata.tableName,
      action: 'DELETE',
      before: event.databaseEntity,
    });
  }

  private getUserIdFromContext(): string | undefined {
    const store = requestContext.getStore();
    return store?.get('userId') ?? undefined;
  }

  private shouldSkipAudit(): boolean {
    const store = requestContext.getStore();
    const path = store?.get('path');
    const method = store?.get('method');

    if (path === '/users' && method === 'POST') return true;
    return false;
  }
}
