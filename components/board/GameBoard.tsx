'use client';

import { ActiveGameBoardToken, GameBoardType } from '@/types/GameBoardTypes';
import {
  arrayRemove,
  arrayUnion,
  doc,
  onSnapshot,
  updateDoc,
} from '@firebase/firestore';
import { useEffect, useState } from 'react';
import db from '@/app/firebase';
import { useCampaign } from '@/hooks/useCampaign';
import { DndContext, pointerWithin } from '@dnd-kit/core';
import { GameBoardCell } from '@/components/board/GameBoardCell';
import { CELL_SIZE } from '@/app/globals';
import Image from 'next/image';
import ActiveGameToken from '@/components/board/ActiveGameToken';
import _ from 'lodash';

const GameBoard = (props: { scale: number; boardId: string }) => {
  const { campaign } = useCampaign();
  const [board, setBoard] = useState<GameBoardType>();
  const [movingToken, setMovingToken] = useState<ActiveGameBoardToken | null>(
    null
  );

  // Subscribe to receive live board updates
  useEffect(() => {
    const docRef = doc(db, 'gameBoards', props.boardId);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setBoard(docSnap.data() as GameBoardType);
      } else {
        console.error('The queried board does not exist.');
      }
    });
    // Cleanup
    return () => {
      unsubscribe();
    };
  }, [props.boardId]);

  // Update board css class
  useEffect(() => {
    const gameBoard = document.querySelector('#game-board');
    if (gameBoard && board) {
      // @ts-ignore
      gameBoard.style.gridTemplateColumns = `repeat(${board.width}, minmax(0, 1fr))`;
    }
  }, [board?.width]);

  const moveToken = async (coords: [number, number]) => {
    const docRef = doc(db, 'gameBoards', props.boardId);
    const movingTokenRef = _.cloneDeep(movingToken);
    setMovingToken(null);

    await updateDoc(docRef, {
      activeTokens: arrayRemove(movingTokenRef),
    });

    await updateDoc(docRef, {
      activeTokens: arrayUnion({
        ...movingTokenRef,
        boardPosition: coords,
      }),
    });
  };

  const handleDragToken = async (event: any) => {
    const { over } = event;
    const coords: [number, number] = over.id
      .split(',')
      .map((coord: string) => parseInt(coord, 10));
    await moveToken(coords);
  };

  // TODO: Make bg stretch to always perfectly fit cell grid
  // TODO: Image caching?
  // TODO: Investigate glitch where token duplicates upon moving a lot via click
  return (
    // DO NOT GIVE THIS COMPONENT ANY SIBLINGS!!! IT WILL BREAK THE BOARD
    <>
      {board && (
        <DndContext
          onDragEnd={handleDragToken}
          collisionDetection={pointerWithin}
        >
          <div
            style={{
              transform: `scale(${props.scale})`,
            }}
            className="w-dvw h-full relative flex items-center justify-center"
          >
            {board?.backgroundImgURL && (
              // TODO: Fix AspectRatio - currently hides child image
              // <AspectRatio ratio={board.width / board.height}>
              <Image
                src={board.backgroundImgURL}
                width={CELL_SIZE * board.width}
                height={CELL_SIZE * board.height}
                alt={`${board.title}'s Background Image`}
                className="absolute"
              />
              // </AspectRatio>
            )}
            <div id="game-board" className="absolute">
              {Array.from({ length: board.height }, (__, rowIndex) =>
                Array.from({ length: board.width }, (__, colIndex) => {
                  const token = board.activeTokens.find(
                    (token) =>
                      token.boardPosition[0] === colIndex &&
                      token.boardPosition[1] === rowIndex
                  );
                  return (
                    <div key={`${colIndex},${rowIndex}`}>
                      <GameBoardCell
                        onMouseDown={(event: any) => {
                          event?.button === 0 && setMovingToken(token ?? null);
                        }}
                        isMovingToken={!_.isNil(movingToken)}
                        droppableId={`${colIndex},${rowIndex}`}
                      >
                        {token && (
                          <ActiveGameToken
                            token={token}
                            selected={movingToken?.id === token.id}
                            nullifySelection={() => setMovingToken(null)}
                          />
                        )}
                      </GameBoardCell>
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
