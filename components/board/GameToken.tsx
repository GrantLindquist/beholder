import { GameBoardToken } from '@/types/GameBoardTypes';
import Image from 'next/image';
import { useEffect } from 'react';
import { CELL_SIZE } from '@/app/globals';
import DEFAULT_AVATAR from '@/public/assets/defualt_token.jpg';

// TODO: Image caching?
const GameToken = (props: { token: GameBoardToken }) => {
  useEffect(() => {}, [props.token.image]);

  return (
    <div>
      <Image
        src={props.token.image || DEFAULT_AVATAR}
        alt={props.token.title}
        width={CELL_SIZE}
        height={CELL_SIZE}
      ></Image>
      {/*<p>{props.token.title}</p>*/}
    </div>
  );
};
export default GameToken;
