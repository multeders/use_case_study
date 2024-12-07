import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './user.entity';

@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => User)
  async user(@Args('email') email: string,) {
    return this.userService.findByEmail(email);
  }

  @Mutation(() => User)
  async register(
    @Args('username') username: string,
    @Args('email') email: string,
    @Args('password') password: string,
    @Args('phone', { nullable: true }) phone?: string,
  ) {
    return this.userService.createUser(username, email, password, phone);
  }
}
