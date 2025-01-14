import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ColumnDeleteCardsDto {
	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	id!: string;

	@ApiProperty()
	@IsString()
	@IsOptional()
	socketId?: string;
}
