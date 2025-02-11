import React from 'react';
import { SetterOrUpdater } from 'recoil';
import { deepClone } from 'fast-json-patch';

import { highlight2Colors } from '@/styles/stitches/partials/colors/highlight2.colors';
import { styled } from '@/styles/stitches/stitches.config';

import LeftArrow from '@/components/CardBoard/CardBody/LeftArrow';
import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Avatar from '@/components/Primitives/Avatars/Avatar/Avatar';
import Box from '@/components/Primitives/Layout/Box/Box';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Separator from '@/components/Primitives/Separator/Separator';
import Text from '@/components/Primitives/Text/Text';
import { CreateBoardData } from '@/store/createBoard/atoms/create-board.atom';
import { BoardToAdd } from '@/types/board/board';
import { BoardUserToAdd } from '@/types/board/board.user';
import { BoardUserRoles } from '@/utils/enums/board.user.roles';
import { getInitials } from '@/utils/getInitials';
import AvatarGroup from '@/components/Primitives/Avatars/AvatarGroup/AvatarGroup';

interface SubCardBoardProps {
  index: number;
  board: BoardToAdd;
  setBoard: SetterOrUpdater<CreateBoardData>;
}

const Container = styled(Flex, Box, {});

const SubCardBoard: React.FC<SubCardBoardProps> = ({ board, index, setBoard }) => {
  const { users } = board;
  const responsible = users.find((user) => user.role === BoardUserRoles.RESPONSIBLE)?.user;

  const handleLottery = () => {
    const cloneUsers = [...deepClone(users)].flatMap((user) => {
      if (!user.isNewJoiner && user.canBeResponsible)
        return {
          ...user,
          role: BoardUserRoles.MEMBER,
        };
      return [];
    });

    if (cloneUsers.length <= 1) return;

    let userFound: BoardUserToAdd | undefined;
    do {
      userFound = cloneUsers[Math.floor(Math.random() * cloneUsers.length)];
    } while (userFound?.user.email === responsible?.email);

    if (!userFound) return;
    userFound.role = BoardUserRoles.RESPONSIBLE;

    const listUsers = users.map(
      (user) => cloneUsers.find((member) => member._id === user._id) || user,
    );

    setBoard((prevBoard) => ({
      ...prevBoard,
      board: {
        ...prevBoard.board,
        dividedBoards: prevBoard.board.dividedBoards.map((boardFound, i) => {
          if (i === index) {
            return { ...boardFound, users: listUsers };
          }
          return boardFound;
        }),
      },
    }));
  };

  return (
    <Flex css={{ flex: '1 1 0', width: '100%' }}>
      <LeftArrow index={index} isDashboard={false} />

      <Container
        align="center"
        elevation="1"
        justify="between"
        css={{
          backgroundColor: 'white',
          height: '$64',
          width: '100%',
          ml: '$40',
          py: '$16',
          pl: '$32',
          pr: '$24',
        }}
      >
        <Flex align="center" justify="start">
          <Text heading="5">{board.title}</Text>
        </Flex>

        <Flex align="center" justify="start" css={{ width: '50%' }}>
          <Flex align="center" css={{ minWidth: '$160' }}>
            <Text css={{ mr: '$8' }}>Responsible Lottery</Text>
            <Separator orientation="vertical" size="md" />
          </Flex>

          <Flex align="center" css={{ minWidth: 0 }}>
            {users.length <= 1 ? (
              <Flex
                align="center"
                justify="center"
                css={{
                  height: '$24',
                  minWidth: '$24',
                  width: '$24',
                  borderRadius: '$round',
                  border: '1px solid $colors$primary400',
                  ml: '$12',
                  opacity: '0.2',
                }}
                onClick={handleLottery}
              >
                <Icon
                  name="wand"
                  css={{
                    width: '$12',
                    height: '$12',
                  }}
                />
              </Flex>
            ) : (
              <Flex
                align="center"
                justify="center"
                css={{
                  height: '$24',
                  minWidth: '$24',
                  width: '$24',
                  borderRadius: '$round',
                  border: '1px solid $colors$primary400',
                  ml: '$12',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    backgroundColor: '$primary400',
                    color: 'white',
                  },
                }}
                onClick={handleLottery}
              >
                <Icon
                  name="wand"
                  css={{
                    width: '$12',
                    height: '$12',
                  }}
                />
              </Flex>
            )}
            <Flex css={{ minWidth: 0 }}>
              <Text
                color="primary300"
                css={{
                  mx: '$8',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                }}
                size="sm"
              >
                {responsible?.firstName} {responsible?.lastName}
              </Text>
            </Flex>
            <Avatar
              css={{ position: 'relative', minWidth: '$34' }}
              fallbackText={getInitials(
                responsible?.firstName ?? '-',
                responsible?.lastName ?? '-',
              )}
              size={32}
              colors={{
                bg: highlight2Colors.highlight2Lighter,
                fontColor: highlight2Colors.highlight2Dark,
              }}
            />
          </Flex>
        </Flex>

        <Flex align="center" gap="8" justify="center">
          <Text size="sm">Sub team {index + 1}</Text>
          <AvatarGroup listUsers={board.users} userId="1" hasDrawer />
        </Flex>
      </Container>
    </Flex>
  );
};

export default SubCardBoard;
