import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Audit, AuditSchema } from './entity/audit.entity';
import { AuditService } from './audit.service';
import { AuditSubscriber } from './audit.subscriber';

@Module({
  imports: [MongooseModule.forFeature([{ name: Audit.name, schema: AuditSchema }])],
  providers: [AuditService, AuditSubscriber],
})
export class AuditModule {}
