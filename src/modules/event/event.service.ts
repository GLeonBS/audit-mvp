import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './event.entity';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  async create(name: string): Promise<Event> {
    const event = this.eventRepository.create({ name });
    return await this.eventRepository.save(event);
  }

  async findAll(): Promise<Event[]> {
    return await this.eventRepository.find();
  }

  async findOne(id: string): Promise<Event> {
    const event = await this.eventRepository.findOne({ where: { id } });
    if (!event) throw new NotFoundException(`Event with id ${id} not found`);
    return event;
  }

  async update(id: string, name: string): Promise<Event> {
    const event = await this.findOne(id);
    event.name = name;
    return await this.eventRepository.save(event);
  }

  async delete(id: string): Promise<void> {
    const result = await this.eventRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }
  }
}
