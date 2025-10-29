import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Audit extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  entity: string;

  @Prop({ type: Object })
  before: Record<string, any>; // estado anterior

  @Prop({ required: true })
  action: 'CREATE' | 'UPDATE' | 'DELETE';
}

export const AuditSchema = SchemaFactory.createForClass(Audit);
