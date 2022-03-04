import { CopyIcon, Pencil2Icon } from "@modulz/radix-icons";
import ToastMessage from "../../../utils/toast";
import { styled } from "../../../stitches.config";
import Flex from "../../Primitives/Flex";
import BoardType from "../../../types/board/board";
import { NEXT_PUBLIC_NEXTAUTH_URL } from "../../../utils/constants";
import { ROUTES } from "../../../utils/routes";
import { EditBoardTitle } from "../../../types/board/editTitle";
import DeleteBoardButton from "./DeleteBoardButton";
import Button from "../../Primitives/Button";

const Container = styled(Flex);
const CopyUrlIcon = styled(CopyIcon, { size: "100%" });
const EditIcon = styled(Pencil2Icon, { size: "100%" });

interface CardHeaderType extends EditBoardTitle {
  board: BoardType;
}

const CardHeader: React.FC<CardHeaderType> = ({ board, isEditing, onClickEdit }) => {
  const handleCopyUrl = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation();
    if (isEditing) onClickEdit(!isEditing);
    if (board._id)
      navigator.clipboard.writeText(`${NEXT_PUBLIC_NEXTAUTH_URL + ROUTES.BoardPage(board._id)}`);
    ToastMessage("Copied link to clipboard!", "info");
  };

  const handleEditTitle = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation();
    onClickEdit(!isEditing);
  };

  return (
    <Container justify="between" css={{ alignSelf: "flex-start", mt: "$4", width: "100%" }}>
      <Button css={{ m: 0, p: 2, lineHeight: 0, height: "fit-content" }} onClick={handleCopyUrl}>
        <CopyUrlIcon />
      </Button>
      <Button css={{ m: 0, p: 2, lineHeight: 0, height: "fit-content" }} onClick={handleEditTitle}>
        <EditIcon />
      </Button>
      <DeleteBoardButton isEditing={isEditing} boardId={board._id} onClickEdit={onClickEdit} />
    </Container>
  );
};

export default CardHeader;
