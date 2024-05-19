import { GameBoardToken } from '@/types/GameBoardTypes';
import { ReactNode } from 'react';
import { useDroppable } from '@dnd-kit/core';

type GameBoardCellProps = {
  onClick: () => void;
  token: GameBoardToken | null;
  droppableId: string;
  children: ReactNode;
};

export const GameBoardCell = ({
  onClick,
  token,
  children,
  droppableId,
}: GameBoardCellProps) => {
  const { setNodeRef } = useDroppable({
    id: droppableId,
  });

  return (
    <div
      onClick={onClick}
      ref={setNodeRef}
      className="size-12 border border-gray-600"
    >
      {children}
    </div>
  );
};
