import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Inject,
	Injectable
} from '@nestjs/common';
import * as Boards from 'src/modules/boards/interfaces/types';
import * as BoardUsers from 'src/modules/boardUsers/interfaces/types';
import TeamUser from 'src/modules/teamUsers/entities/team.user.schema';
import Team from 'src/modules/teams/entities/team.schema';
import User from 'src/modules/users/entities/user.schema';
import { Reflector } from '@nestjs/core';
import { GetBoardServiceInterface } from 'src/modules/boards/interfaces/services/get.board.service.interface';
import { GetBoardUserServiceInterface } from 'src/modules/boardUsers/interfaces/services/get.board.user.service.interface';

@Injectable()
export class GetBoardGuard implements CanActivate {
	constructor(
		private readonly reflector: Reflector,
		@Inject(Boards.TYPES.services.GetBoardService)
		private getBoardService: GetBoardServiceInterface,
		@Inject(BoardUsers.TYPES.services.GetBoardUserService)
		private getBoardUserService: GetBoardUserServiceInterface
	) {}

	async canActivate(context: ExecutionContext) {
		const permissions = this.reflector.get<string>('permissions', context.getHandler());
		const request = context.switchToHttp().getRequest();

		const { _id: userId, isAnonymous, isSAdmin } = request.user;
		const boardId: string = request.params.boardId;

		try {
			const { isPublic, team } = await this.getBoardService.getBoardData(boardId);
			const boardUserFound = await this.getBoardUserService.getBoardUser(boardId, userId);

			if (isPublic || boardUserFound || isSAdmin) {
				return true;
			}

			if (!boardUserFound) {
				const { role: teamRole } = (team as Team).users.find(
					(teamUser: TeamUser) => (teamUser.user as User)._id.toString() === userId.toString()
				);

				return !isAnonymous && permissions.includes(teamRole);
			}
		} catch (error) {
			throw new ForbiddenException();
		}
	}
}
