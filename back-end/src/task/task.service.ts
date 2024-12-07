import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RabbitMQService } from '../common/rabbitmq.service';
import { Repository } from 'typeorm';
import { Task } from './task.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    private readonly rabbitMQService: RabbitMQService
  ) {}

  findAll(userId: number): Promise<Task[]> {
    return this.taskRepository.find({ where: { user: { id: userId } } });
  }

  async createTask(title: string, description: string, status: string, userId: number): Promise<Task> {
    const task = this.taskRepository.create({ title, description, status, user: { id: userId } });
    return this.taskRepository.save(task);
  }

  async editTask(id: number, updates: Partial<Task>, userId: number): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id, user: { id: userId } } });
  
    if (!task) {
      throw new Error('Task not found');
    }
  
    Object.assign(task, updates);
  
    return this.taskRepository.save(task);
  }

  async deleteTask(id: number, userId: number): Promise<boolean> {
    const task = await this.taskRepository.findOne({ where: { id, user: { id: userId } } });

    if (!task) {
      throw new ForbiddenException('You do not have permission to delete this task');
    }
    const result = await this.taskRepository.delete(id);

    if (result.affected === 0) {
      throw new Error(`Task with ID ${id} not found`);
    }

    return true;
  }

  async sendNotification(email: string, phone: string, message: string) {
    const notification = { email, phone, message };
    await this.rabbitMQService.sendToQueue('notifications', notification);
  }

}
