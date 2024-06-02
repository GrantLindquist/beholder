'use client';

import { ActiveGameBoardToken } from '@/types/GameBoardTypes';
import { arrayRemove, arrayUnion, doc, updateDoc } from '@firebase/firestore';
import { useEffect, useState } from 'react';
import db from '@/app/firebase';
import { DndContext, pointerWithin } from '@dnd-kit/core';
import { GameBoardCell } from '@/components/board/GameBoardCell';
import { CELL_SIZE } from '@/app/globals';
import Image from 'next/image';
import ActiveGameToken from '@/components/board/ActiveGameToken';
import _ from 'lodash';
import FogOfWar from '@/components/board/FogOfWar';
import { useCampaign } from '@/hooks/useCampaign';
import { useUser } from '@/hooks/useUser';
import CellContextMenu from '@/components/board/CellContextMenu';
import { useFocusedBoard } from '@/hooks/useFocusedBoard';

const GameBoard = (props: { scale: number; boardId: string }) => {
  const { focusedBoard } = useFocusedBoard();
  const { isUserDm } = useCampaign();
  const { user } = useUser();

  const [movingToken, setMovingToken] = useState<ActiveGameBoardToken | null>(
    null
  );

  // Update board css class
  useEffect(() => {
    const gameBoard = document.querySelector('#game-board');
    if (gameBoard && focusedBoard) {
      const columns = `repeat(${focusedBoard.width}, minmax(0, 1fr))`;
      // @ts-ignore
      gameBoard.style.gridTemplateColumns = columns;
    }
  }, [focusedBoard?.width]);

  const moveToken = async (coords: [number, number]) => {
    const docRef = doc(db, 'gameBoards', props.boardId);
    const movingTokenRef = _.cloneDeep(movingToken);
    setMovingToken(null);

    // TODO: Is removing entire token instead of updating nested value really the best option here?
    await updateDoc(docRef, {
      activeTokens: arrayRemove(movingTokenRef),
    });

    await updateDoc(docRef, {
      activeTokens: arrayUnion({
        ...movingTokenRef,
        boardPosition: coords,
        lastMovedAt: Date.now(),
      }),
    });
  };

  // TODO: Figure out how to prevent handleDragToken from triggering "too many re-renders" warning
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

  // TODO: Make bg stretch to always perfectly fit cell grid
  return (
    // DO NOT GIVE THIS COMPONENT ANY SIBLINGS!!! IT WILL BREAK THE BOARD
    <>
      {focusedBoard && (
        <DndContext
          onDragEnd={handleDragToken}
          collisionDetection={pointerWithin}
        >
          <div
            style={{
              transform: `scale(${props.scale})`,
            }}
            className="w-dvw h-full relative flex items-center justify-center border-2 border-red-400"
          >
            {focusedBoard?.backgroundImgURL && (
              <Image
                src={focusedBoard.backgroundImgURL}
                width={CELL_SIZE * focusedBoard.width}
                height={CELL_SIZE * focusedBoard.height}
                alt={`${focusedBoard.title}'s Background Image`}
                className="absolute"
              />
            )}
            {focusedBoard?.settings?.fowEnabled && <FogOfWar />}
            <div id="game-board" className="absolute">
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
        </DndContext>
      )}
    </>
  );
};
export default GameBoard;
