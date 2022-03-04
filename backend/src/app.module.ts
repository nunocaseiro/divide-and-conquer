import { Module } from '@nestjs/common';
import DatabaseModule from './infrastructure/database/database.module';
import UsersModule from './modules/users/users.module';
import AuthModule from './modules/auth/auth.module';
import BoardsModule from './modules/boards/boards.module';
import SocketModule from './modules/socket/socket.module';
import { CardsModule } from './modules/cards/cards.module';
import { CommentsModule } from './modules/comments/comments.module';
import ConfigsModule from './infrastructure/config/config.module';
import { VotesModule } from './modules/votes/votes.module';
import AzureModule from './modules/azure/azure.module';
import { configuration } from './infrastructure/config/configuration';

const imports: any = [
  ConfigsModule,
  DatabaseModule,
  UsersModule,
  AuthModule,
  BoardsModule,
  SocketModule,
  CardsModule,
  CommentsModule,
  VotesModule,
];

if (configuration().azure.enabled) {
  imports.push(AzureModule);
}

@Module({
  imports,
  controllers: [],
  providers: [],
})
export default class AppModule {}
