'use client';

import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { doc, updateDoc } from '@firebase/firestore';
import db from '@/app/firebase';
import { useFocusedBoard } from '@/hooks/useFocusedBoard';
import { getDefaultFowMatrix } from '@/utils/fow';
import { useFow } from '@/hooks/useFow';
import _ from 'lodash';

const EditFogOfWar = () => {
  const { focusedBoard } = useFocusedBoard();
  const { eraseFow, setEraseFow } = useFow();

  const handleResetFow = async () => {
    if (focusedBoard) {
      await updateDoc(doc(db, 'gameBoards', focusedBoard.id), {
        fowCells: getDefaultFowMatrix(focusedBoard.width, focusedBoard.height),
      });
    }
  };

  return (
    <>
      <DropdownMenuLabel>Fog of War</DropdownMenuLabel>
      <DropdownMenuItem
        onClick={() => setEraseFow(true)}
        className={eraseFow ? 'bg-gray-800' : ''}
      >
        Reveal Cells
      </DropdownMenuItem>
      <DropdownMenuItem
        onClick={() => setEraseFow(false)}
        className={eraseFow === false ? 'bg-gray-800' : ''}
      >
        Hide Cells
      </DropdownMenuItem>
      <DropdownMenuItem
        disabled={_.isNull(eraseFow)}
        onClick={() => setEraseFow(null)}
      >
        Stop Editing
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={handleResetFow}>
        Reset Fog of War
      </DropdownMenuItem>
    </>
  );
};
export default EditFogOfWar;
