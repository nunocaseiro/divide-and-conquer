import { useRouter } from "next/router";
import { useMutation, useQuery } from "react-query";
import { useSession } from "next-auth/react";
import ToastMessage from "../utils/toast";
import BoardType from "../types/board/board";
import {
  deleteBoardRequest,
  getBoardRequest,
  getBoardsRequest,
  createBoardRequest,
  updateCardPositionRequest,
  updateBoardRequest,
  addCardRequest,
  deleteCardRequest,
  updateCardRequest,
  addCommentRequest,
  deleteCommentRequest,
  updateCommentRequest,
  addVoteRequest,
  deleteVoteRequest,
  exchangeCardOfCardGroupRequest,
  mergeCardsRequest,
  removeFromMergeRequest,
} from "../api/boardService";
import UseBoardType from "../types/board/useBoard";
import { decrementVote, incrementVote, setChangesBoard } from "../store/slicer/boardSlicer";
import { useAppDispatch } from "../store/hooks";

interface AutoFetchProps {
  autoFetchBoard: boolean;
  autoFetchBoards: boolean;
}

const useBoard = ({
  autoFetchBoard = false,
  autoFetchBoards = false,
}: AutoFetchProps): UseBoardType => {
  const router = useRouter();
  const { data: session } = useSession({ required: false });
  const userId = session?.user.id;

  const boardId = String(router.query.boardId);
  const dispatch = useAppDispatch();
  // #region BOARD

  const fetchBoard = useQuery(["board", { id: boardId }], () => getBoardRequest(boardId), {
    enabled: autoFetchBoard,
    refetchOnWindowFocus: false,
    onError: () => {
      ToastMessage("Error getting the board", "error");
    },
  });

  const fetchBoards = useQuery("boards", () => getBoardsRequest(), {
    enabled: autoFetchBoards,
    refetchOnWindowFocus: autoFetchBoards,
  });

  const createBoard = useMutation(createBoardRequest, {
    onSuccess: (data: BoardType) => {
      router.push(`/boards/${data._id}`);
    },
    onError: () => {
      ToastMessage("Board not created!", "error");
    },
  });

  const deleteBoard = useMutation(deleteBoardRequest, {
    onSuccess: () => {
      ToastMessage("Board deleted!", "success");
      fetchBoards.refetch();
    },
    onError: () => {
      ToastMessage("Board not deleted!", "error");
    },
  });

  const updateBoard = useMutation(updateBoardRequest, {
    onSuccess: (board: BoardType, variables) => {
      ToastMessage("Board updated!", "success");
      if (!variables.boardPage) {
        fetchBoards.refetch();
      }
    },
    onError: () => {
      ToastMessage("Board not updated!", "error");
    },
  });

  // #endregion

  // #region CARD

  const addCardInColumn = useMutation(addCardRequest, {
    onSuccess: (board: BoardType) => {
      dispatch(setChangesBoard({ board, userId }));
    },
    onError: () => {
      fetchBoard.refetch();
      ToastMessage("Card not inserted!", "error");
    },
  });

  const updateCardPosition = useMutation(updateCardPositionRequest, {
    onSuccess: (board: BoardType) => {
      dispatch(setChangesBoard({ board, userId }));
    },
    onError: () => {
      fetchBoard.refetch();
      ToastMessage("Board not updated!", "error");
    },
  });

  const updateCard = useMutation(updateCardRequest, {
    onSuccess: (board: BoardType) => {
      dispatch(setChangesBoard({ board, userId }));
    },
    onError: () => {
      fetchBoard.refetch();
      ToastMessage("Card not updated!", "error");
    },
  });

  const deleteCard = useMutation(deleteCardRequest, {
    onSuccess: (board: BoardType) => {
      dispatch(setChangesBoard({ board, userId }));
    },
    onError: () => {
      fetchBoard.refetch();
      ToastMessage("Card not deleted!", "error");
    },
  });

  // #endregion

  // #region COMMENT

  const addCommentInCard = useMutation(addCommentRequest, {
    onSuccess: (board: BoardType) => {
      dispatch(setChangesBoard({ board, userId }));
    },
    onError: () => {
      fetchBoard.refetch();
      ToastMessage("Comment not inserted!", "error");
    },
  });

  const deleteComment = useMutation(deleteCommentRequest, {
    onSuccess: (board: BoardType) => {
      dispatch(setChangesBoard({ board, userId }));
    },
    onError: () => {
      fetchBoard.refetch();
      ToastMessage("Comment not deleted!", "error");
    },
  });

  const updateComment = useMutation(updateCommentRequest, {
    onSuccess: (board: BoardType) => {
      dispatch(setChangesBoard({ board, userId }));
    },
    onError: () => {
      fetchBoard.refetch();
      ToastMessage("Comment not updated!", "error");
    },
  });

  // #endregion

  // #region MERGE_CARDS

  const mergeCards = useMutation(mergeCardsRequest, {
    onSuccess: (board: BoardType) => {
      dispatch(setChangesBoard({ board, userId }));
    },
    onError: () => {
      fetchBoard.refetch();
      ToastMessage("Board not updated!", "error");
    },
  });

  const removeFromMergeCard = useMutation(removeFromMergeRequest, {
    onSuccess: (board: BoardType) => {
      dispatch(setChangesBoard({ board, userId }));
    },
    onError: () => {
      fetchBoard.refetch();
      ToastMessage("Board not updated!", "error");
    },
  });

  const exchangeCardOfCardGroup = useMutation(exchangeCardOfCardGroupRequest, {
    onSuccess: (board: BoardType) => {
      dispatch(setChangesBoard({ board, userId }));
    },
    onError: () => {
      fetchBoard.refetch();
      ToastMessage("Board not updated!", "error");
    },
  });

  // #endregion

  // #region VOTES

  const addVote = useMutation(addVoteRequest, {
    onSuccess: (board: BoardType) => {
      dispatch(incrementVote());
      dispatch(setChangesBoard({ board, userId }));
    },
    onError: () => {
      fetchBoard.refetch();
      ToastMessage("Vote not inserted!", "error");
    },
  });

  const deleteVote = useMutation(deleteVoteRequest, {
    onSuccess: (board: BoardType) => {
      dispatch(decrementVote());
      dispatch(setChangesBoard({ board, userId }));
    },
    onError: () => {
      fetchBoard.refetch();
      ToastMessage("Vote not deleted!", "error");
    },
  });

  // #endregion

  return {
    fetchBoard,
    fetchBoards,
    createBoard,
    deleteBoard,
    updateBoard,
    addCardInColumn,
    updateCard,
    deleteCard,
    updateCardPosition,
    addCommentInCard,
    updateComment,
    deleteComment,
    addVote,
    deleteVote,
    mergeCards,
    removeFromMergeCard,
    exchangeCardOfCardGroup,
  };
};

export default useBoard;
