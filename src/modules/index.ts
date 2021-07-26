import { BrokerModule } from '././broker/broker.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { APP_GUARD } from '@nestjs/core';

import { NewsModule } from './news/news.module';
import { CommentModule } from './comment/comment.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { ProjectsModule } from './projects/projects.module';
import { AuthModule } from './auth/auth.module';
import { CompaniesModule } from './companies/companies.module';
import { CatePropertyModule } from './categoryProperty/categoryProperty.module';
import { PropertyModule } from './property/property.module';
import { JwtAuthGuard } from './auth/guards/jwt';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot({
      autoSchemaFile: true,
    }),
    PrismaModule,
    UserModule,
    ProjectsModule,
    NewsModule,
    CommentModule,
    AuthModule,
    CompaniesModule,
    PropertyModule,
    BrokerModule,
    CatePropertyModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
