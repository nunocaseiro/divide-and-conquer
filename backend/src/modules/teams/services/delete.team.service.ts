import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DELETE_FAILED } from 'src/libs/exceptions/messages';
import { DeleteTeamServiceInterface } from '../interfaces/services/delete.team.service.interface';
import { TYPES } from '../interfaces/types';
import { TeamRepositoryInterface } from '../interfaces/repositories/team.repository.interface';
import * as Boards from '../../boards/interfaces/types';
import * as TeamUsers from '../../teamUsers/interfaces/types';
import { DeleteBoardServiceInterface } from 'src/modules/boards/interfaces/services/delete.board.service.interface';
import { DeleteTeamUserServiceInterface } from 'src/modules/teamUsers/interfaces/services/delete.team.user.service.interface';

@Injectable()
export default class DeleteTeamService implements DeleteTeamServiceInterface {
	constructor(
		@Inject(TYPES.repositories.TeamRepository)
		private readonly teamRepository: TeamRepositoryInterface,
		@Inject(Boards.TYPES.services.DeleteBoardService)
		private deleteBoardService: DeleteBoardServiceInterface,
		@Inject(TeamUsers.TYPES.services.DeleteTeamUserService)
		private deleteTeamUserService: DeleteTeamUserServiceInterface
	) {}

	async delete(teamId: string): Promise<boolean> {
		await this.teamRepository.startTransaction();
		await this.deleteTeamUserService.startTransaction();

		try {
			await this.deleteTeam(teamId, true);
			await this.deleteTeamUserService.deleteTeamUsersOfTeam(teamId, true);

			await this.deleteBoardService.deleteBoardsByTeamId(teamId);

			await this.teamRepository.commitTransaction();
			await this.deleteTeamUserService.commitTransaction();

			return true;
		} catch (e) {
			await this.teamRepository.abortTransaction();
			await this.deleteTeamUserService.abortTransaction();
		} finally {
			await this.teamRepository.endSession();
			await this.deleteTeamUserService.endSession();
		}
		throw new BadRequestException(DELETE_FAILED);
	}

	private async deleteTeam(teamId: string, withSession: boolean) {
		const result = await this.teamRepository.findOneAndRemoveByField(
			{
				_id: teamId
			},
			withSession
		);

		if (!result) throw new NotFoundException(DELETE_FAILED);
	}
}
