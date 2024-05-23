import { ReactNode } from 'react';
import { useDroppable } from '@dnd-kit/core';

type GameBoardCellProps = {
  onMouseDown: (event: any) => void;
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

  // TODO: Make sure that cells cannot constrict size
  return (
    <div
      onMouseDown={onMouseDown}
      ref={setNodeRef}
      className={`size-12 border border-white border-opacity-20 ${isMovingToken && 'hover:bg-white hover:bg-opacity-20'}`}
    >
      {children}
    </div>
  );
};
