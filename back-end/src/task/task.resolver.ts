import { Int } from '@nestjs/graphql';
import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { TaskService } from './task.service';
import { UserService } from '../user/user.service';
import { Task } from './task.entity';
import { AuthGuard } from '../auth/auth.guard';


@Resolver(() => Task)
export class TaskResolver {
  constructor(
    private taskService: TaskService,
    private readonly userService: UserService
  ) {}

  @Query(() => [Task])
  @UseGuards(AuthGuard)
  async tasks(
    @Context() context: any
  ) {
    const userId = context.user?.sub;
    return this.taskService.findAll(userId);
  }

  @Mutation(() => Task)
  @UseGuards(AuthGuard)
  async createTask(
    @Args('title') title: string,
    @Args('description') description: string,
    @Args('status') status: string,
    @Context() context: any
  ) {
    const userId = context.user?.sub;
    const users = await this.userService.findNotifiedUsers(userId);
    const task = await this.taskService.createTask(title, description, status, userId); 
    if(task && users.length > 0) {
      users.forEach(user => {
        this.taskService.sendNotification(user.email, user.phone, `Task ${task.title} created`);
      });
    }
    return task;
  }

  @Mutation(() => Task)
  @UseGuards(AuthGuard)
  async editTask(
    @Args('id', { type: () => Int }) id: number,
    @Context() context: any,
    @Args('title', { nullable: true }) title?: string,
    @Args('description', { nullable: true }) description?: string,
    @Args('status', { nullable: true }) status?: string
  ): Promise<Task> {
    const userId = context.user?.sub;
    return this.taskService.editTask(id, { title, description, status }, userId);
  }

  @Mutation(() => Boolean)
  @UseGuards(AuthGuard)
  async deleteTask(
    @Args('id', { type: () => Int }) id: number, 
    @Context() context: any) {
    const userId = context.user?.sub;
    return this.taskService.deleteTask(id, userId);
  }
}
