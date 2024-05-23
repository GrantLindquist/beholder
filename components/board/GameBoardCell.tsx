import { ReactNode } from 'react';
import { useDroppable } from '@dnd-kit/core';

type GameBoardCellProps = {
  onMouseDown: () => void;
  isMovingToken: boolean;
  droppableId: string;
  children: ReactNode;
};

export const GameBoardCell = ({
  onMouseDown,
  isMovingToken,
  children,
  droppableId,
}: GameBoardCellProps) => {
  const { setNodeRef } = useDroppable({
    id: droppableId,
  });

  const getHoverClass = () => {
    return isMovingToken ? 'hover:bg-white hover:bg-opacity-20' : '';
  };

  // TODO: Make sure that cells cannot constrict
  return (
    <div
      onMouseDown={onMouseDown}
      ref={setNodeRef}
      className={`size-12 border border-white border-opacity-20 ${getHoverClass()}`}
    >
      {children}
    </div>
  );
};
