import { ActiveGameBoardToken } from '@/types/GameBoardTypes';
import Image from 'next/image';
import DEFAULT_AVATAR from '@/public/assets/defualt_token.jpg';
import { useDraggable } from '@dnd-kit/core';
import { CELL_SIZE } from '@/app/globals';

// TODO: Image caching?
const ActiveGameToken = (props: {
  token: ActiveGameBoardToken;
  selected?: boolean;
  movable: boolean;
  onMouseDown: (event: any) => void;
  onMouseUp: () => void;
}) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: props.token.id,
  });

  return (
    <>
      <div
        ref={setNodeRef}
        className={`${props.movable ? 'cursor-move' : ''} ${props.selected ? 'ring-4' : ''}`}
        onMouseDown={props.onMouseDown}
        onMouseUp={props.onMouseUp}
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
          {props.token.monsterNumber && `\u00A0(${props.token.monsterNumber})`}
        </p>
      </div>
    </>
  );
};
export default ActiveGameToken;
