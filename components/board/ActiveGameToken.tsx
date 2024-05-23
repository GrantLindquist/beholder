import { ActiveGameBoardToken } from '@/types/GameBoardTypes';
import Image from 'next/image';
import DEFAULT_AVATAR from '@/public/assets/defualt_token.jpg';
import { useDraggable } from '@dnd-kit/core';
import { CELL_SIZE } from '@/app/globals';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { arrayRemove, doc, updateDoc } from '@firebase/firestore';
import db from '@/app/firebase';
import { useFocusedBoard } from '@/hooks/useFocusedBoard';

// TODO: Image caching?
const ActiveGameToken = (props: {
  token: ActiveGameBoardToken;
  selected?: boolean;
  nullifySelection: () => void;
}) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: props.token.id,
  });

  const { focusedBoard } = useFocusedBoard();

  const handleRemoveToken = async (event: any) => {
    event.stopPropagation();
    props.nullifySelection();
    if (focusedBoard) {
      const boardDocRef = doc(db, 'gameBoards', focusedBoard.id);
      await updateDoc(boardDocRef, {
        activeTokens: arrayRemove(props.token),
      });
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          ref={setNodeRef}
          className={`cursor-move ${props.selected && 'ring-4'}`}
          {...listeners}
          {...attributes}
        >
          <Image
            src={props.token.tokenImgURL || DEFAULT_AVATAR}
            alt={props.token.title}
            height={CELL_SIZE}
            width={CELL_SIZE}
          />
        </div>
        <div className="bg-gray-300 bg-opacity-70 text-zinc-950 rounded relative w-fit mt-1">
          <p className="text-xs text-center px-1.5">
            {props.token.title}
            {props.token.monsterNumber &&
              `\u00A0(${props.token.monsterNumber})`}
          </p>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuLabel>{props.token.title}</ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuItem>Add Condition</ContextMenuItem>
        <ContextMenuItem>Kill</ContextMenuItem>
        <ContextMenuItem onClick={handleRemoveToken}>Remove</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
export default ActiveGameToken;
