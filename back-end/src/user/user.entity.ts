import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Task } from '../task/task.entity';

@ObjectType()
@Entity()
export class User {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  username: string;

  @Field()
  @Column()
  email: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  phone?: string | null;

  @Field()
  @Column()
  password: string;

  @Field(() => [Task]) // Expose the one-to-many relationship with tasks
  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];
}
