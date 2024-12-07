import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import * as jwt from 'jsonwebtoken';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TaskModule } from './task/task.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver, // Specify the Apollo driver here
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'), // Automatically generate the schema
      context: ({ req }) => {
        // Extract token and decode user
        const authHeader = req.headers.authorization || '';
        const token = authHeader.split(' ')[1];

        let user = null;
        if (token) {
          try {
            user = jwt.verify(token, process.env.JWT_SECRET);
          } catch (err) {
            console.error('Invalid token:', err.message);
          }
        }

        return { user }; // Attach user to context
      },
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity.{ts,js}'],
      synchronize: true,
    }),
    AuthModule,
    UserModule,
    TaskModule,
  ],
})


export class AppModule {}
