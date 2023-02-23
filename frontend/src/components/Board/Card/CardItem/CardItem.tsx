import React, { useState } from 'react';

import { styled } from '@/styles/stitches/stitches.config';

import AddCardOrComment from '@/components/Board/AddCardOrComment';
import Flex from '@/components/Primitives/Flex';
import Text from '@/components/Primitives/Text';
import { CardItemType } from '@/types/card/cardItem';
import CardFooter from '../CardFooter';
import DeleteCard from '../DeleteCard';
import PopoverCardSettings from '../PopoverSettings';

interface CardItemProps {
  item: CardItemType;
  color: string;
  lastOne?: boolean;
  firstOne: boolean;
  columnId: string;
  boardId: string;
  cardGroupId: string;
  socketId: string;
  cardGroupPosition: number;
  anonymous: boolean;
  userId: string;
  isMainboard: boolean;
  isSubmited: boolean;
  hideCards: boolean;
  isDefaultText: boolean;
  hasAdminRole: boolean;
  postAnonymously: boolean;
  cardTextDefault?: string;
}

const Container = styled(Flex, {
  paddingTop: '$12',
  paddingBottom: '$14',
  wordBreak: 'breakWord',
});

const CardItem: React.FC<CardItemProps> = React.memo(
  ({
    item,
    color,
    firstOne,
    lastOne,
    columnId,
    boardId,
    cardGroupId,
    socketId,
    cardGroupPosition,
    anonymous,
    userId,
    isMainboard,
    isSubmited,
    hideCards,
    isDefaultText,
    hasAdminRole,
    postAnonymously,
    cardTextDefault,
  }) => {
    const [editing, setEditing] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const handleDeleting = () => {
      setDeleting(!deleting);
    };

    const handleEditing = () => {
      setEditing(!editing);
    };

    return (
      <Container css={{ backgroundColor: color }} direction="column" gap="10" justify="between">
        {!editing && (
          <Flex direction="column">
            <Flex css={{ '& > div': { zIndex: 2 }, mb: lastOne ? 0 : '$12' }} justify="between">
              <Text
                size="sm"
                css={{
                  wordBreak: 'break-word',
                  whiteSpace: 'pre-line',
                }}
              >
                {item.text}
              </Text>
              {!isSubmited &&
                ((userId === item?.createdBy?._id && !isMainboard) ||
                  hasAdminRole ||
                  !isMainboard) && (
                  <PopoverCardSettings
                    isItem
                    boardId={boardId}
                    cardGroupId={cardGroupId}
                    columnId={columnId}
                    firstOne={firstOne}
                    handleDeleteCard={handleDeleting}
                    handleEditing={handleEditing}
                    hideCards={hideCards}
                    item={item}
                    itemId={item._id}
                    newPosition={cardGroupPosition}
                    socketId={socketId}
                    userId={userId}
                    hasAdminRole={hasAdminRole}
                  />
                )}
            </Flex>

            {!lastOne && (
              <CardFooter
                isItem
                anonymous={anonymous}
                boardId={boardId}
                card={item}
                hideCards={hideCards}
                isMainboard={isMainboard}
                socketId={socketId}
                userId={userId}
              />
            )}
          </Flex>
        )}
        {editing && !isSubmited && (
          <AddCardOrComment
            isCard
            isEditing
            isUpdate
            boardId={boardId}
            cancelUpdate={handleEditing}
            cardId={cardGroupId}
            cardItemId={item._id}
            cardText={item.text}
            colId={columnId}
            socketId={socketId}
            anonymous={item.anonymous}
            isDefaultText={isDefaultText}
            postAnonymously={postAnonymously}
            cardTextDefault={cardTextDefault}
          />
        )}
        {deleting && (
          <DeleteCard
            boardId={boardId}
            cardId={cardGroupId}
            cardItemId={item._id}
            cardTitle={item.text}
            handleClose={handleDeleting}
            socketId={socketId}
            userId={userId}
            columnId={columnId}
          />
        )}
      </Container>
    );
  },
);

export default CardItem;
