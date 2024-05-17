import { GameBoardToken } from '@/types/GameBoardTypes';
import Image from 'next/image';
import { useEffect } from 'react';
import { CELL_SIZE } from '@/app/globals';
import DEFAULT_AVATAR from '@/public/assets/defualt_token.jpg';
import { useDraggable } from '@dnd-kit/core';

// TODO: Image caching?
const GameToken = (props: { token: GameBoardToken; selected?: boolean }) => {
  useEffect(() => {}, [props.token.image]);

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
        src={props.token.image || DEFAULT_AVATAR}
        alt={props.token.title}
        width={CELL_SIZE}
        height={CELL_SIZE}
      />
      {/*<p>{props.token.title}</p>*/}
    </div>
  );
};
export default GameToken;
