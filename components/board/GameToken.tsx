import { GameBoardToken } from '@/types/GameBoardTypes';
import Image from 'next/image';
import { useEffect } from 'react';
import { CELL_SIZE } from '@/app/globals';
import DEFAULT_AVATAR from '@/public/assets/defualt_token.jpg';

// TODO: Image caching?
const GameToken = (props: { token: GameBoardToken; selected?: boolean }) => {
  useEffect(() => {}, [props.token.image]);

  const getSelectedClass = (selected: boolean) => {
    if (selected) {
      return 'ring-4';
    }
  };

  return (
    <div className={getSelectedClass(props.selected ?? false)}>
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
