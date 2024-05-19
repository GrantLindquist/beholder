import { GameBoardToken } from '@/types/GameBoardTypes';
import Image from 'next/image';
import DEFAULT_AVATAR from '@/public/assets/defualt_token.jpg';
import { useDraggable } from '@dnd-kit/core';
import { CELL_SIZE } from '@/app/globals';

// TODO: Image caching?
const GameToken = (props: { token: GameBoardToken; selected?: boolean }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: props.token.id,
  });

  const getSelectedClass = () => {
    return props.selected ? 'ring-4' : '';
  };

  return (
    <div
      ref={setNodeRef}
      className={getSelectedClass()}
      {...(props.selected && listeners)}
      {...(props.selected && attributes)}
    >
      <Image
        src={props.token.tokenImgURL || DEFAULT_AVATAR}
        alt={props.token.title}
        height={CELL_SIZE}
        width={CELL_SIZE}
      />
      {/*<p>{props.token.title}</p>*/}
    </div>
  );
};
export default GameToken;
