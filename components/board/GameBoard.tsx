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

const GameBoard = (props: { scale: number; boardId: string }) => {
  const [board, setBoard] = useState<GameBoardType>();
  const [movingToken, setMovingToken] = useState<ActiveGameBoardToken | null>(
    null
  );

  const { campaign } = useCampaign();

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

  const handleCellClick = async (
    containedToken: ActiveGameBoardToken | null,
    coords: [number, number]
  ) => {
    if (movingToken) {
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
    } else {
      containedToken && setMovingToken(containedToken);
    }
  };

  // TODO: Replace gap w/ functioning borders
  // TODO: Fix grid to support values other than grid-cols-10
  const getGridClass = (numCols: number, numRows: number) => {
    return `grid grid-cols-${numCols} grid-rows-${numRows} gap-1`;
  };

  return (
    <>
      {board && (
        <>
          <h1>{_.get(campaign, 'title')}</h1>
          <div className={getGridClass(board.width, board.height)}>
            {Array.from({ length: board.height }, (__, rowIndex) =>
              Array.from({ length: board.width }, (__, colIndex) => {
                const token = board.activeTokens.find(
                  (token) =>
                    token.boardPosition[0] === colIndex &&
                    token.boardPosition[1] === rowIndex
                );
                return (
                  <div
                    key={`${colIndex},${rowIndex}`}
                    className="size-12 bg-stone-900"
                    onClick={() =>
                      handleCellClick(token || null, [colIndex, rowIndex])
                    }
                  >
                    {token && <GameToken token={token} />}
                  </div>
                );
              })
            )}
          </div>
        </>
      )}
    </>
  );
};
export default GameBoard;
