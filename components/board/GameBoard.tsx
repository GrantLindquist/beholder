'use client';

import { ActiveGameBoardToken } from '@/types/GameBoardTypes';
import { memo, useEffect } from 'react';
import GameBoardCell from '@/components/board/GameBoardCell';
import { CELL_SIZE } from '@/app/globals';
import Image from 'next/image';
import ActiveGameToken from '@/components/board/ActiveGameToken';
import _ from 'lodash';
import FogOfWar from '@/components/board/FogOfWar';
import CellContextMenu from '@/components/board/CellContextMenu';
import { useFocusedBoard } from '@/hooks/useFocusedBoard';
import { useUser } from '@/hooks/useUser';
import { useCampaign } from '@/hooks/useCampaign';
import { TransformComponent, useControls } from 'react-zoom-pan-pinch';

const GameBoard = () => {
  const { focusedBoard } = useFocusedBoard();
  const { isUserDm } = useCampaign();
  const { user } = useUser();
  const { resetTransform } = useControls();

  // Update board css class
  useEffect(() => {
    const gameBoard = document.querySelector('#game-board');
    if (gameBoard && focusedBoard) {
      const columns = `repeat(${focusedBoard.width}, minmax(${CELL_SIZE}px, ${CELL_SIZE}px))`;
      const rows = `repeat(${focusedBoard.height}, minmax(${CELL_SIZE}px, ${CELL_SIZE}px))`;
      // @ts-ignore
      gameBoard.style.gridTemplateColumns = columns;
      // @ts-ignore
      gameBoard.style.gridTemplateRows = rows;
    }
    resetTransform();
  }, [focusedBoard?.width, focusedBoard?.height]);

  // TODO: Make sure that dragging logic makes sense, i was tired when i re-wrote it
  // TODO: Disable entire board from re-rendering when token is picked up and placed
  return (
    <>
      {focusedBoard && (
        <TransformComponent
          wrapperStyle={{
            width: '100%',
            height: '100%',
          }}
        >
          <div
            style={{
              width: focusedBoard.width * CELL_SIZE,
              height: focusedBoard.height * CELL_SIZE,
            }}
            className={`relative`}
          >
            {focusedBoard?.backgroundImgURL && (
              <Image
                src={focusedBoard.backgroundImgURL}
                width={CELL_SIZE * focusedBoard.width}
                height={CELL_SIZE * focusedBoard.height}
                alt={`${focusedBoard.title}'s Background Image`}
                className="absolute w-full h-full"
              />
            )}
            {focusedBoard?.settings?.fowEnabled && <FogOfWar />}
            <div id="game-board" className="absolute w-full h-full">
              {Array.from({ length: focusedBoard.height }, (__, rowIndex) =>
                Array.from({ length: focusedBoard.width }, (__, colIndex) => {
                  const token = focusedBoard.activeTokens.reduce(
                    (
                      highestToken: ActiveGameBoardToken | null,
                      currentToken: ActiveGameBoardToken
                    ): ActiveGameBoardToken | null => {
                      if (
                        currentToken.boardPosition[0] === colIndex &&
                        currentToken.boardPosition[1] === rowIndex &&
                        (!highestToken ||
                          currentToken.lastMovedAt > highestToken.lastMovedAt)
                      ) {
                        return currentToken;
                      }
                      return highestToken;
                    },
                    null
                  );
                  const movable = isUserDm || token?.ownerId === user?.uid;
                  return (
                    <CellGroupMemo
                      key={`${colIndex},${rowIndex}`}
                      colIndex={colIndex}
                      rowIndex={rowIndex}
                      token={token}
                      movable={movable}
                    />
                  );
                })
              )}
            </div>
          </div>
        </TransformComponent>
      )}
    </>
  );
};
export default GameBoard;

const GameBoardCellGroup = (props: {
  colIndex: number;
  rowIndex: number;
  token: ActiveGameBoardToken | null;
  movable: boolean;
}) => {
  const { updateToken, movingToken, setMovingToken } = useFocusedBoard();

  const handleDragToken = async (
    token: ActiveGameBoardToken,
    coords: [number, number]
  ) => {
    if (
      coords[0] !== token.boardPosition[0] ||
      coords[1] !== token.boardPosition[1]
    ) {
      setMovingToken(null);

      token &&
        (await updateToken(token, {
          boardPosition: coords,
          lastMovedAt: Date.now(),
        }));
    }
  };

  return (
    <div key={`${props.colIndex},${props.rowIndex}`}>
      <CellContextMenu
        token={props.token}
        coords={[props.colIndex, props.rowIndex]}
        disabled={!_.isNil(props.token) && !props.movable}
      >
        <GameBoardCell
          onMouseUp={() => {
            movingToken &&
              handleDragToken(movingToken, [props.colIndex, props.rowIndex]);
          }}
          onClick={() => {
            movingToken &&
              handleDragToken(movingToken, [props.colIndex, props.rowIndex]);
          }}
        >
          {props.token && (
            <ActiveGameToken
              onMouseDown={(event: any) => {
                if (event?.button === 0 && props.movable) {
                  setMovingToken(props.token);
                }
              }}
              token={props.token}
              selected={movingToken?.id === props.token.id}
              movable={props.movable}
            />
          )}
        </GameBoardCell>
      </CellContextMenu>
    </div>
  );
};

const CellGroupMemo = memo(GameBoardCellGroup, (prevProps, nextProps) => {
  // @ts-ignore
  return prevProps.token?.id === nextProps.token?.id;
});
