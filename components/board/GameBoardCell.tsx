import { ReactNode } from 'react';
import { useFocusedBoard } from '@/hooks/useFocusedBoard';

type GameBoardCellProps = {
  onMouseUp: () => void;
  onClick: () => void;
  children: ReactNode;
};

const GameBoardCell = ({
  children,
  onMouseUp,
  onClick,
}: GameBoardCellProps) => {
  const { movingToken } = useFocusedBoard();
  return (
    <div
      className={`size-full border border-white border-opacity-20 ${movingToken && 'hover:bg-white hover:bg-opacity-20'}`}
      onMouseUp={onMouseUp}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
export default GameBoardCell;
