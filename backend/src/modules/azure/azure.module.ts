import { Module } from '@nestjs/common';
import AuthModule from '../auth/auth.module';
import { CommunicationModule } from '../communication/communication.module';
import { StorageModule } from '../storage/storage.module';
import UsersModule from '../users/users.module';
import { authAzureApplication, authAzureService } from './azure.providers';
import AzureController from './controller/azure.controller';

@Module({
	imports: [UsersModule, AuthModule, CommunicationModule, StorageModule],
	controllers: [AzureController],
	providers: [authAzureService, authAzureApplication]
})
export default class AzureModule {}
