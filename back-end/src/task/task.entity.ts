import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';

@ObjectType() // Marks this class as a GraphQL Object Type
@Entity()
export class Task {
  @Field() // Expose this field in GraphQL schema
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  title: string;

  @Field({ nullable: true }) // Allows this field to be nullable in GraphQL schema
  @Column({ nullable: true })
  description: string;

  @Field()
  @Column()
  status: string;

  @Field(() => User, { nullable: true }) // Expose the user relationship
  @ManyToOne(() => User, (user) => user.tasks, { eager: true })
  user: User;
}
