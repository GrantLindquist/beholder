import { GameBoardToken } from '@/types/GameBoardTypes';
import Image from 'next/image';
import DEFAULT_AVATAR from '@/public/assets/defualt_token.jpg';
import { CELL_SIZE } from '@/app/globals';

// TODO: Image caching?
const GameToken = (props: { token: GameBoardToken; selected?: boolean }) => {
  const getSelectedClass = () => {
    return props.selected ? 'ring-4' : '';
  };

  return (
    <div className="max-w-12">
      <div className={getSelectedClass()}>
        <Image
          src={props.token.tokenImgURL || DEFAULT_AVATAR}
          alt={props.token.title}
          height={CELL_SIZE}
          width={CELL_SIZE}
        />
      </div>
      <p className="text-xs text-center">{props.token.title}</p>
    </div>
  );
};
export default GameToken;
