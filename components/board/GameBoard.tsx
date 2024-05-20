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
import _ from 'lodash';
import { useCampaign } from '@/hooks/useCampaign';
import GameToken from '@/components/board/GameToken';
import { closestCorners, DndContext } from '@dnd-kit/core';
import { GameBoardCell } from '@/components/board/GameBoardCell';
import { CELL_SIZE } from '@/app/globals';
import Image from 'next/image';

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

    await updateDoc(docRef, {
      activeTokens: arrayRemove(movingToken),
    });

    await updateDoc(docRef, {
      activeTokens: arrayUnion({
        ...movingToken,
        boardPosition: coords,
      }),
    });

    setMovingToken(null);
  };

  const handleCellClick = async (
    coords: [number, number],
    token: ActiveGameBoardToken | null
  ) => {
    if (movingToken) {
      if (
        movingToken.boardPosition[0] !== coords[0] ||
        movingToken.boardPosition[1] !== coords[1]
      ) {
        await moveToken(coords);
      }
    } else {
      setMovingToken(token);
    }
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
    <>
      {board && (
        <DndContext
          onDragEnd={handleDragToken}
          collisionDetection={closestCorners}
        >
          <h1>{_.get(campaign, 'title')}</h1>
          <div
          // style={{
          //   transform: `scale(${props.scale})`,
          // }}
          >
            {board?.backgroundImgURL && (
              <Image
                src={board.backgroundImgURL}
                width={CELL_SIZE * board.width}
                height={CELL_SIZE * board.height}
                alt={`${board.title}'s Background Image`}
                className="absolute top-0 right-0"
              />
            )}
            <div id="game-board" className="absolute top-0 right-0">
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
                        onClick={() =>
                          handleCellClick([colIndex, rowIndex], token || null)
                        }
                        droppableId={`${colIndex},${rowIndex}`}
                      >
                        {token ? (
                          <GameToken
                            token={token}
                            selected={movingToken?.id === token.id}
                          />
                        ) : (
                          <></>
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
