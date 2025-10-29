import { Audit } from './entity/audit.entity';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AuditService {
  constructor(@InjectModel(Audit.name) private model: Model<Audit>) {}

  async create(data: Partial<Audit>) {
    await this.model.create({
      ...data,
      createdAt: new Date(),
    });
  }
}