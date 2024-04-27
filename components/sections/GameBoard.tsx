'use client';

import { GameBoardType } from '@/types/GameBoardTypes';
import { doc, onSnapshot } from '@firebase/firestore';
import { useEffect, useState } from 'react';
import db from '@/app/firebase';
import _ from 'lodash';
import { useCampaign } from '@/hooks/useCampaign';
import { Box, Grid } from '@mui/material';
import { CELL_SIZE } from '@/app/globals';

const GameBoard = (props: { scale: number; boardId: string }) => {
  const [board, setBoard] = useState<GameBoardType>();
  const [isMovingToken, setIsMovingToken] = useState(false);

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

  // TODO: Complete token movement
  const handleCellClick = async (id: string, coords: [number, number]) => {
    // if (isMovingToken) {
    //   console.log('test');
    //   const docRef = doc(db, 'gameBoards', props.boardId);
    //   await updateDoc(docRef, {
    //     activeTokens: arrayRemove(id),
    //   });
    //   setIsMovingToken(false);
    // } else {
    //   setIsMovingToken(true);
    // }
  };

  return (
    <>
      {board && (
        <>
          <h1>{_.get(campaign, 'title')}</h1>
          {isMovingToken && <p>moving token!</p>}
          <Grid
            id="game_board"
            maxWidth={board.width * CELL_SIZE}
            container
            columns={board.width}
            sx={{
              overflow: 'auto',
              transform: `scale(${props.scale})`,
            }}
          >
            {Array.from({ length: board.height }, (__, rowIndex) =>
              Array.from({ length: board.width }, (__, colIndex) => {
                const token = board.activeTokens.find(
                  (token) =>
                    token.boardPosition[0] === colIndex &&
                    token.boardPosition[1] === rowIndex
                );

                return (
                  <Grid item key={`${rowIndex}-${colIndex}`} xs={1}>
                    <Box
                      sx={{
                        height: CELL_SIZE,
                        width: CELL_SIZE,
                        borderWidth: 1,
                        borderColor: 'grey',
                        borderStyle: 'solid',
                      }}
                    >
                      {token && (
                        <div
                          key={token.id}
                          onClick={() =>
                            handleCellClick(token.id, [rowIndex, colIndex])
                          }
                        >
                          <p>{token.title}</p>
                        </div>
                      )}
                    </Box>
                  </Grid>
                );
              })
            )}
          </Grid>
        </>
      )}
    </>
  );
};
export default GameBoard;
