import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { ExhibitionModule } from './exhibition/exhibition.module';
import { FeedbackModule } from './feedback/feedback.module';
import { ComplexityPlugin } from './graphql/complexity.plugin';
import { HallModule } from './hall/hall.module';
import { OrderModule } from './order/order.module';
import { PrismaModule } from './prisma.module';
import { TicketModule } from './ticket/ticket.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      csrfPrevention: false,
      introspection: true,
    }),
    PrismaModule,
    AuthModule,
    ExhibitionModule,
    HallModule,
    OrderModule,
    FeedbackModule,
    TicketModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [ComplexityPlugin],
})
export class AppModule {}
