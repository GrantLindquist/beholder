import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { ReactNode } from 'react';
import { ActiveGameBoardToken } from '@/types/GameBoardTypes';
import { useFocusedBoard } from '@/hooks/useFocusedBoard';
import { arrayRemove, doc, updateDoc } from '@firebase/firestore';
import db from '@/app/firebase';

type TokenContextMenuProps = {
  token: ActiveGameBoardToken;
  nullifySelection: () => void;
  children: ReactNode;
};

const TokenContextMenu = ({
  token,
  nullifySelection,
  children,
}: TokenContextMenuProps) => {
  const { focusedBoard } = useFocusedBoard();

  const handleRemoveToken = async (event: any) => {
    event.stopPropagation();
    nullifySelection();
    if (focusedBoard) {
      const boardDocRef = doc(db, 'gameBoards', focusedBoard.id);
      await updateDoc(boardDocRef, {
        activeTokens: arrayRemove(token),
      });
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuLabel>{token.title}</ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuItem>Add Condition</ContextMenuItem>
        <ContextMenuItem>Kill</ContextMenuItem>
        <ContextMenuItem onClick={handleRemoveToken}>Remove</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
export default TokenContextMenu;
