'use client';

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import TokenList from '@/components/sections/TokenList';

type CellContextMenuProps = {
  token: ActiveGameBoardToken | null;
  coords: [number, number];
  children: ReactNode;
};

const CellContextMenu = ({ token, coords, children }: CellContextMenuProps) => {
  const { focusedBoard } = useFocusedBoard();

  const handleRemoveToken = async (event: any) => {
    event.stopPropagation();
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
      {token ? (
        <ContextMenuContent>
          <ContextMenuLabel>{token.title}</ContextMenuLabel>
          <ContextMenuSeparator />
          <ContextMenuItem>Add Condition</ContextMenuItem>
          <ContextMenuItem>Kill</ContextMenuItem>
          <ContextMenuItem onClick={handleRemoveToken}>Remove</ContextMenuItem>
        </ContextMenuContent>
      ) : (
        <ContextMenuContent>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <ContextMenuLabel>{`(x:${coords[0]}, y:${coords[1]})`}</ContextMenuLabel>
              <ContextMenuSeparator />
              <ContextMenuItem>Place Token</ContextMenuItem>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-w-72 ml-3">
              <TokenList placeCoord={coords} />
            </DropdownMenuContent>
          </DropdownMenu>
        </ContextMenuContent>
      )}
    </ContextMenu>
  );
};
export default CellContextMenu;
