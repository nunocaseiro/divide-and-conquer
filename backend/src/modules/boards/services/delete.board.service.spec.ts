import { Test, TestingModule } from '@nestjs/testing';
import { DeleteBoardServiceInterface } from '../interfaces/services/delete.board.service.interface';
import * as Boards from 'src/modules/boards/interfaces/types';
import * as CommunicationTypes from 'src/modules/communication/interfaces/types';
import * as Schedules from 'src/modules/schedules/interfaces/types';
import * as BoardUsers from 'src/modules/boardUsers/interfaces/types';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { BoardRepositoryInterface } from '../repositories/board.repository.interface';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { deleteBoardService } from '../boards.providers';
import { BoardFactory } from 'src/libs/test-utils/mocks/factories/board-factory.mock';
import { DeleteBoardUserServiceInterface } from 'src/modules/boardUsers/interfaces/services/delete.board.user.service.interface';
import { DeleteSchedulesServiceInterface } from 'src/modules/schedules/interfaces/services/delete.schedules.service.interface';
import { ArchiveChannelServiceInterface } from 'src/modules/communication/interfaces/archive-channel.service.interface';

const boards = BoardFactory.createMany(2);
const board = BoardFactory.create({
	dividedBoards: BoardFactory.createMany(2),
	slackEnable: true
});

describe('DeleteBoardService', () => {
	let service: DeleteBoardServiceInterface;
	let boardRepositoryMock: DeepMocked<BoardRepositoryInterface>;
	let deleteBoardUserServiceMock: DeepMocked<DeleteBoardUserServiceInterface>;
	let deleteSchedulesServiceMock: DeepMocked<DeleteSchedulesServiceInterface>;
	let achiveChannelServiceMock: DeepMocked<ArchiveChannelServiceInterface>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				deleteBoardService,
				{
					provide: Boards.TYPES.repositories.BoardRepository,
					useValue: createMock<BoardRepositoryInterface>()
				},
				{
					provide: BoardUsers.TYPES.services.DeleteBoardUserService,
					useValue: createMock<DeleteBoardUserServiceInterface>()
				},
				{
					provide: Schedules.TYPES.services.DeleteSchedulesService,
					useValue: createMock<DeleteSchedulesServiceInterface>()
				},
				{
					provide: CommunicationTypes.TYPES.services.SlackArchiveChannelService,
					useValue: createMock<ArchiveChannelServiceInterface>()
				}
			]
		}).compile();
		service = module.get<DeleteBoardServiceInterface>(deleteBoardService.provide);
		boardRepositoryMock = module.get(Boards.TYPES.repositories.BoardRepository);
		deleteBoardUserServiceMock = module.get(BoardUsers.TYPES.services.DeleteBoardUserService);
		deleteSchedulesServiceMock = module.get(Schedules.TYPES.services.DeleteSchedulesService);
		achiveChannelServiceMock = module.get(
			CommunicationTypes.TYPES.services.SlackArchiveChannelService
		);
	});

	beforeEach(() => {
		jest.clearAllMocks();
		jest.restoreAllMocks();

		//Mock returns
		boardRepositoryMock.getBoard.mockResolvedValue(board);
		boardRepositoryMock.deleteBoard.mockResolvedValue(board);

		deleteSchedulesServiceMock.deleteScheduleByBoardId.mockResolvedValue(null);
		boardRepositoryMock.deleteManySubBoards.mockResolvedValue(2);
		deleteBoardUserServiceMock.deleteDividedBoardUsers.mockResolvedValue(2);
		deleteBoardUserServiceMock.deleteSimpleBoardUsers.mockResolvedValue(2);

		boardRepositoryMock.getAllBoardsByTeamId.mockResolvedValue(boards);
		deleteSchedulesServiceMock.findAndDeleteScheduleByBoardId.mockResolvedValue(null);

		//Slack Enabled
		boardRepositoryMock.getBoardPopulated.mockResolvedValue(board);
		achiveChannelServiceMock.execute.mockResolvedValue(null);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('delete', () => {
		it('should return true if deleteBoardBoardUsersAndSchedules succeded', async () => {
			await expect(service.delete('boardId')).resolves.toBe(true);
		});

		it('should throw notFoundException when board not found ', async () => {
			boardRepositoryMock.getBoard.mockResolvedValue(null);

			await expect(service.delete('boardId')).rejects.toThrow(NotFoundException);
		});

		it('should throw error if boardRepository.deleteManySubBoards fails', async () => {
			boardRepositoryMock.deleteManySubBoards.mockResolvedValue(1);

			await expect(service.delete('boardId')).rejects.toThrowError(BadRequestException);
		});

		it('should throw error when deleteBoardUserService.deleteDividedBoardUsers fails', async () => {
			deleteBoardUserServiceMock.deleteDividedBoardUsers.mockResolvedValue(0);

			await expect(service.delete('boardId')).rejects.toThrowError(BadRequestException);
		});

		it('should throw error boardRepository.deleteBoard return null', async () => {
			boardRepositoryMock.deleteBoard.mockResolvedValue(null);
			await expect(service.delete('boardId')).rejects.toThrowError(BadRequestException);
		});
	});

	describe('deleteBoardsByTeamId', () => {
		it('should return true if board deleted ', async () => {
			await expect(service.deleteBoardsByTeamId('teamId')).resolves.toBe(true);
		});

		it('should throw badRequestException when deleteBoardUserService.deleteSimpleBoardUsers fails', async () => {
			deleteBoardUserServiceMock.deleteSimpleBoardUsers.mockResolvedValue(0);

			await expect(service.deleteBoardsByTeamId('teamId')).rejects.toThrowError(
				BadRequestException
			);
		});
	});
});
