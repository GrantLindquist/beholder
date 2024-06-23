import { ActiveGameBoardToken } from '@/types/GameBoardTypes';
import Image from 'next/image';
import DEFAULT_AVATAR from '@/public/assets/default_token.jpg';
import { CELL_SIZE } from '@/app/globals';
import _ from 'lodash';
import ConditionBadge from '@/components/board/ConditionBadge';
import DeathBadge from '@/components/board/DeathBadge';

const ActiveGameToken = (props: {
  token: ActiveGameBoardToken;
  selected?: boolean;
  movable: boolean;
  onMouseDown: (event: any) => void;
}) => {
  return (
    <>
      <div
        className={`relative ${props.movable ? 'cursor-move' : ''} ${props.selected ? 'ring-4' : ''}`}
        onMouseDown={props.onMouseDown}
      >
        {props.token.dead ? (
          <DeathBadge />
        ) : (
          <>
            {_.size(props.token.conditions) > 0 && (
              <ConditionBadge conditions={props.token.conditions} />
            )}
          </>
        )}

        <div className={`${props.token.dead ? 'grayscale' : ''}`}>
          <Image
            src={props.token.tokenImgURL || DEFAULT_AVATAR}
            alt={props.token.title}
            height={CELL_SIZE}
            width={CELL_SIZE}
          />
        </div>
      </div>
      <div className="bg-gray-300 bg-opacity-70 text-zinc-950 rounded relative w-fit mt-1">
        {!props.token.dead && (
          <p className="text-xs text-center px-1.5">
            {props.token.title}
            {props.token.monsterNumber &&
              `\u00A0(${props.token.monsterNumber})`}
          </p>
        )}
      </div>
    </>
  );
};
export default ActiveGameToken;
