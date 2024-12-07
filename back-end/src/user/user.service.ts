import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email } });
  }

  findNotifiedUsers(id: number): Promise<User[]> {
    return this.userRepository.find({ where: { id: Not(id) } });
  }

  async createUser(username: string, email: string, password: string, phone?: string | null) {
    password = await bcrypt.hash(password, 10);
    const alreadyExists = await this.findByEmail(email);
    if (alreadyExists) {
      throw new Error('User already exists');
    }
    const user = this.userRepository.create({ username, email, phone, password });
    return this.userRepository.save(user);
  }
}
