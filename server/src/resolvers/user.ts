import {
  Resolver,
  Ctx,
  Arg,
  Mutation,
  InputType,
  Field,
  ObjectType,
} from 'type-graphql';
import { MyContext } from '../types';
import argon2 from 'argon2';
import { User } from '../entities/User';

@InputType()
class UserInput {
  @Field()
  username: string;
  @Field()
  password: string;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  //if there was an error, return the error, else return the user. that's why they are nullable and have a ?
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Mutation(() => UserResponse)
  async registerUser(
    @Ctx() { em }: MyContext,
    @Arg('options', () => UserInput) options: UserInput
  ): Promise<UserResponse> {
    if (options.username.length === 0)
      return {
        errors: [{ field: 'username', message: 'cant have an empty username' }],
      };
    if (options.password.length === 0)
      return {
        errors: [{ field: 'password', message: 'cant have an empty password' }],
      };
    const hashedPass = await argon2.hash(options.password);
    const user = em.create(User, {
      username: options.username,
      password: hashedPass,
    });
    try {
      await em.persistAndFlush(user);
    } catch (error) {
      if (error.code === '23505')
        return {
          errors: [{ field: 'username', message: 'username already taken' }],
        };
    }
    return { user };
  }

  @Mutation(() => UserResponse)
  async loginUser(
    @Ctx() { em }: MyContext,
    @Arg('options', () => UserInput) options: UserInput
  ): Promise<UserResponse> {
    const user = await em.findOne(User, { username: options.username });
    if (!user)
      return {
        errors: [{ field: 'username', message: 'username doesnt exist' }],
      };
    const validPass = await argon2.verify(user.password, options.password);
    if (!validPass)
      return {
        errors: [{ field: 'password', message: 'incorrect password' }],
      };

    return { user };
  }
}
