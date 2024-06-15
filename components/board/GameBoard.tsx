'use client';

import { ActiveGameBoardToken } from '@/types/GameBoardTypes';
import { useEffect, useState } from 'react';
import { DndContext, pointerWithin } from '@dnd-kit/core';
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

const GameBoard = (props: { toggleBoardGestures: Function }) => {
  const { focusedBoard, updateToken } = useFocusedBoard();
  const { isUserDm } = useCampaign();
  const { user } = useUser();
  const { resetTransform } = useControls();

  const [movingToken, setMovingToken] = useState<ActiveGameBoardToken | null>(
    null
  );

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

  useEffect(() => {
    props.toggleBoardGestures(movingToken);
  }, [movingToken]);

  const moveToken = async (coords: [number, number]) => {
    const movingTokenRef = _.cloneDeep(movingToken);
    setMovingToken(null);

    movingTokenRef &&
      (await updateToken(movingTokenRef, {
        boardPosition: coords,
        lastMovedAt: Date.now(),
      }));
  };

  const handleDragToken = async (event: any) => {
    const { over } = event;
    if (over && movingToken) {
      const coords: [number, number] = over.id
        .split(',')
        .map((coord: string) => parseInt(coord, 10));
      if (
        coords[0] !== movingToken.boardPosition[0] ||
        coords[1] !== movingToken.boardPosition[1]
      ) {
        await moveToken(coords);
      }
    } else {
      setMovingToken(null);
    }
  };

  return (
    <>
      {focusedBoard && (
        <DndContext
          onDragEnd={handleDragToken}
          collisionDetection={pointerWithin}
        >
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
                {/* TODO: Every cell re-renders on each user action */}
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
                      <div key={`${colIndex},${rowIndex}`}>
                        <CellContextMenu
                          token={token}
                          coords={[colIndex, rowIndex]}
                          disabled={!_.isNil(token) && !movable}
                        >
                          <GameBoardCell
                            isMovingToken={!_.isNil(movingToken)}
                            droppableId={`${colIndex},${rowIndex}`}
                          >
                            {token && (
                              <ActiveGameToken
                                onMouseDown={(event: any) => {
                                  if (event?.button === 0 && movable) {
                                    setMovingToken(token);
                                  }
                                }}
                                onMouseUp={() => {
                                  setMovingToken(null);
                                }}
                                onClick={() => {
                                  movingToken && setMovingToken(null);
                                }}
                                token={token}
                                selected={movingToken?.id === token.id}
                                movable={movable}
                              />
                            )}
                          </GameBoardCell>
                        </CellContextMenu>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </TransformComponent>
        </DndContext>
      )}
    </>
  );
};
export default GameBoard;
