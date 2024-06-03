import { ReactNode } from 'react';
import { useDroppable } from '@dnd-kit/core';

type GameBoardCellProps = {
  isMovingToken: boolean;
  droppableId: string;
  children: ReactNode;
};

export const GameBoardCell = ({
  isMovingToken,
  children,
  droppableId,
}: GameBoardCellProps) => {
  const { setNodeRef } = useDroppable({
    id: droppableId,
  });

  return (
    <div
      ref={setNodeRef}
      className={`size-full border border-white border-opacity-20 ${isMovingToken && 'hover:bg-white hover:bg-opacity-20'}`}
    >
      {children}
    </div>
  );
};
