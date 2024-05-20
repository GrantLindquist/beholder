import { ReactNode } from 'react';
import { useDroppable } from '@dnd-kit/core';

type GameBoardCellProps = {
  onClick: () => void;
  droppableId: string;
  children: ReactNode;
};

export const GameBoardCell = ({
  onClick,
  children,
  droppableId,
}: GameBoardCellProps) => {
  const { setNodeRef } = useDroppable({
    id: droppableId,
  });

  // TODO: Make sure that cells cannot constrict
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
