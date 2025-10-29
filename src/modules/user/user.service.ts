import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  findAll() {
    return this.repo.find();
  }

  create(data: Partial<User>) {
    const user = this.repo.create(data);
    return this.repo.save({
      ...user,
      password: this.generateHash(user.password),
    });
  }

  update(id: string, data: Partial<User>) {
    return this.repo.update(id, data);
  }

  delete(id: string) {
    return this.repo.delete(id);
  }

  findOne(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  generateHash(password: string): string {
    return bcrypt.hashSync(password, 10);
  }
}
