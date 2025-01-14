import { Suspense, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getSession, useSession } from 'next-auth/react';
import useTeam from '@/hooks/useTeam';
import QueryError from '@/components/Errors/QueryError';
import LoadingPage from '@/components/Primitives/Loading/Page/Page';
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next';
import { StyledForm } from '@/styles/pages/pages.styles';
import requireAuthentication from '@/components/HOC/requireAuthentication';
import { getAllTeams, getTeamsOfUser } from '@/api/teamService';
import { dehydrate, QueryClient, useQuery } from '@tanstack/react-query';
import { BoxRowContainer } from '@/components/CreateBoard/SelectBoardType/BoxRowContainer';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import BoardName from '@/components/CreateBoard/BoardName';
import { FormProvider, useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import SettingsTabs from '@/components/CreateBoard/RegularBoard/SettingsTabs';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { toastState } from '@/store/toast/atom/toast.atom';
import { createBoardDataState, createBoardTeam } from '@/store/createBoard/atoms/create-board.atom';
import { teamsOfUser, usersListState } from '@/store/team/atom/team.atom';
import { DASHBOARD_ROUTE } from '@/utils/routes';
import { TeamUserRoles } from '@/utils/enums/team.user.roles';
import SchemaCreateRegularBoard from '@/schema/schemaCreateRegularBoard';
import { getAllUsers } from '@/api/userService';
import { ToastStateEnum } from '@/utils/enums/toast-types';
import useBoard from '@/hooks/useBoard';
import isEmpty from '@/utils/isEmpty';
import { BoardUserRoles } from '@/utils/enums/board.user.roles';
import { BoardUserDto } from '@/types/board/board.user';
import { defaultRegularColumns } from '@/helper/board/defaultColumns';
import TipBar from '@/components/Primitives/Layout/TipBar/TipBar';
import CreateHeader from '@/components/Primitives/Layout/CreateHeader/CreateHeader';
import CreateFooter from '@/components/Primitives/Layout/CreateFooter/CreateFooter';

const defaultBoard = {
  users: [],
  team: null,
  count: {
    teamsCount: 2,
    maxUsersCount: 2,
  },
  board: {
    title: 'Default Board',
    columns: defaultRegularColumns,
    isPublic: false,
    maxVotes: undefined,
    dividedBoards: [],
    recurrent: true,
    users: [],
    team: null,
    isSubBoard: false,
    boardNumber: 0,
    hideCards: false,
    hideVotes: false,
    slackEnable: false,
    addCards: true,
    postAnonymously: false,
  },
};

const NewRegularBoard: NextPage = () => {
  const router = useRouter();
  const { data: session } = useSession({ required: true });

  const [isBackButtonDisable, setBackButtonState] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [createBoard, setCreateBoard] = useState(false);

  const setToastState = useSetRecoilState(toastState);
  const [boardState, setBoardState] = useRecoilState(createBoardDataState);
  const [usersList, setUsersList] = useRecoilState(usersListState);
  const setTeams = useSetRecoilState(teamsOfUser);
  const setSelectedTeam = useSetRecoilState(createBoardTeam);

  // Team  Hook
  const {
    fetchUserBasedTeams: { data },
  } = useTeam();

  const regularBoardTips = [
    {
      title: 'Quick create board',
      description: [
        'If you want to jump the settings you can just hit the button Create board.',
        'You can still adjust all the settings later on inside the board itself.',
      ],
    },
    {
      title: 'Columns',
      description: [
        'We will set the columns by default to 3.',
        'If you want to have more or less you can later, inside the actual board, still adjust the columns.',
      ],
    },
  ];

  const { data: allUsers } = useQuery(['users'], () => getAllUsers(), {
    enabled: true,
    refetchOnWindowFocus: false,
    onError: () => {
      setToastState({
        open: true,
        content: 'Error getting the users',
        type: ToastStateEnum.ERROR,
      });
    },
  });

  useEffect(() => {
    if (data) {
      const availableTeams = data.filter((team) =>
        team.users?.find(
          (teamUser) =>
            teamUser.user._id === session?.user.id &&
            [TeamUserRoles.ADMIN, TeamUserRoles.STAKEHOLDER].includes(teamUser.role),
        ),
      );

      setTeams(session?.user.isSAdmin ? data : availableTeams);
    }

    if (allUsers) {
      const usersWithChecked = allUsers.map((user) => ({
        ...user,
        isChecked: user._id === session?.user.id,
      }));

      setUsersList(usersWithChecked);
    }
  }, [data, setTeams, allUsers, setUsersList, session]);

  /**
   * Board  Hook
   */
  const {
    createBoard: { status, mutate },
  } = useBoard({ autoFetchBoard: false });

  const addNewRegularBoard = () => {
    setCreateBoard(true);
  };

  const methods = useForm<{ text?: string; maxVotes?: number; slackEnable?: boolean }>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      text: '',
      maxVotes: boardState.board.maxVotes,
      slackEnable: false,
    },
    resolver: joiResolver(SchemaCreateRegularBoard),
  });

  const resetListUsersState = useCallback(() => {
    const updateCheckedUser = usersList.map((user) => ({
      ...user,
      isChecked: user._id === session?.user.id,
    }));
    setUsersList(updateCheckedUser);
  }, [session?.user.id, setUsersList, usersList]);

  /**
   * Handle back to boards list page
   */
  const handleBack = useCallback(() => {
    setIsLoading(true);

    resetListUsersState();

    setBackButtonState(true);
    router.back();
  }, [resetListUsersState, router]);

  const handleCancelBtn = () => {
    resetListUsersState();
    setIsLoading(true);

    router.push(DASHBOARD_ROUTE);
  };

  /**
   * Save board

   */
  const saveBoard = (title?: string, maxVotes?: number, slackEnable?: boolean) => {
    const users: BoardUserDto[] = [];
    const responsibles: string[] = [];

    const responsible = boardState.users.find((user) => user.role === BoardUserRoles.RESPONSIBLE);

    if (!isEmpty(responsible)) {
      responsibles.push(responsible.user);
    }

    if (isEmpty(boardState.users) && session) {
      users.push({ role: BoardUserRoles.RESPONSIBLE, user: session?.user.id });
    }

    mutate({
      ...boardState.board,
      columns: defaultRegularColumns,
      users: isEmpty(boardState.users) ? users : boardState.users,
      title: title || defaultBoard.board.title,
      dividedBoards: [],
      maxVotes,
      slackEnable,
      maxUsers: boardState.count.maxUsersCount,
      recurrent: false,
      responsibles,
      phase: undefined,
    });
  };

  const saveEmptyBoard = () => {
    const users: BoardUserDto[] = [];
    if (session) {
      users.push({ role: BoardUserRoles.RESPONSIBLE, user: session?.user.id });
    }

    mutate({
      ...boardState.board,
      columns: defaultRegularColumns,
      users: isEmpty(boardState.users) ? users : boardState.users,
      title: defaultBoard.board.title,
      dividedBoards: [],
      maxUsers: boardState.count.maxUsersCount,
      recurrent: false,
    });
  };

  useEffect(() => {
    if (status === 'success') {
      setIsLoading(true);
      setToastState({
        open: true,
        content: 'Board created with success!',
        type: ToastStateEnum.SUCCESS,
      });

      setBoardState(defaultBoard);
      setSelectedTeam(undefined);
      router.push('/boards');
    }

    return () => {
      setBoardState(defaultBoard);
      setSelectedTeam(undefined);
    };
  }, [router, setToastState, setSelectedTeam, setBoardState, status]);

  if (!session || !data) return null;

  return (
    <Suspense fallback={<LoadingPage />}>
      <QueryError>
        <Flex
          css={{ height: '100vh', backgroundColor: '$primary50', opacity: isLoading ? 0.5 : 1 }}
          direction="column"
        >
          <CreateHeader
            title="Add new Regular board"
            disableBack={isBackButtonDisable}
            handleBack={handleBack}
          />
          {createBoard ? (
            <>
              <Flex
                css={{ height: '100%', position: 'relative', overflowY: 'auto' }}
                direction="column"
              >
                <Flex css={{ flex: '1' }}>
                  <StyledForm
                    id="hook-form"
                    direction="column"
                    onSubmit={methods.handleSubmit(({ text, maxVotes, slackEnable }) => {
                      saveBoard(text, maxVotes, slackEnable);
                    })}
                  >
                    <Flex direction="column">
                      <FormProvider {...methods}>
                        <BoardName
                          title="Board Name"
                          description="Make it short and descriptive. It well help you to distinguish retrospectives from each other."
                        />
                        <SettingsTabs />
                      </FormProvider>
                    </Flex>
                  </StyledForm>
                  <TipBar tips={regularBoardTips} />
                </Flex>
              </Flex>
              <CreateFooter
                disableButton={isBackButtonDisable}
                handleBack={handleCancelBtn}
                formId="hook-form"
                confirmationLabel="Create board"
              />
            </>
          ) : (
            <Flex align="center" justify="center" css={{ height: '100%' }}>
              <Flex gap={16} direction="column">
                <BoxRowContainer
                  iconName="blob-arrow-right"
                  title="Quick create"
                  description="Jump the settings and just create a board. All configurations can still be done within the board itself."
                  handleSelect={saveEmptyBoard}
                  active
                />
                <BoxRowContainer
                  iconName="blob-settings"
                  title="Configure board"
                  description="Select team or participants, configure your board and schedule a date and time."
                  active
                  handleSelect={addNewRegularBoard}
                />
              </Flex>
            </Flex>
          )}
        </Flex>
      </QueryError>
    </Suspense>
  );
};

export const getServerSideProps: GetServerSideProps = requireAuthentication(
  async (context: GetServerSidePropsContext) => {
    // CHECK: 'getServerSession' should be used instead of 'getSession'
    // https://next-auth.js.org/configuration/nextjs#unstable_getserversession
    const session = await getSession({ req: context.req });

    const queryClient = new QueryClient();

    if (session?.user.isSAdmin) {
      await queryClient.prefetchQuery(['userBasedTeams'], () => getAllTeams(context));
    } else {
      await queryClient.prefetchQuery(['userBasedTeams'], () => getTeamsOfUser(undefined, context));
    }

    await queryClient.prefetchQuery(['users'], () => getAllUsers(context));

    return {
      props: {
        dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
      },
    };
  },
);

export default NewRegularBoard;
