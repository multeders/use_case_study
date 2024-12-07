import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Task } from './task.entity';
import { TaskService } from './task.service';
import { TaskResolver } from './task.resolver';
import { UserModule } from '../user/user.module';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]), 
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    CommonModule,
    UserModule
  ],
  providers: [TaskService, TaskResolver],
  exports: [TaskService],
})
export class TaskModule {}
