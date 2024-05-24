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

  // TODO: Make sure that cells cannot constrict size
  return (
    <div
      ref={setNodeRef}
      className={`size-12 border border-white border-opacity-20 ${isMovingToken && 'hover:bg-white hover:bg-opacity-20'}`}
      onClick={() => console.log(children)}
    >
      {children}
    </div>
  );
};
