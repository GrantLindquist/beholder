'use client';

import { GameBoardType } from '@/types/GameBoardTypes';
import { doc, onSnapshot } from '@firebase/firestore';
import { useEffect, useState } from 'react';
import db from '@/app/firebase';
import { CELL_SIZE } from '@/app/globals';
import { Box, Grid } from '@mui/material';
import _ from 'lodash';
import { useCampaign } from '@/hooks/useCampaign';

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

  const handleCellClick = () => {
    if (isMovingToken) {
    } else {
    }
  };

  // TODO: Make the grid render function not suck
  return (
    <>
      {board && (
        <>
          <h1>{_.get(campaign, 'title')}</h1>
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
            {Array.from({ length: board.height }, (_, rowIndex) =>
              Array.from({ length: board.width }, (_, colIndex) => (
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
                    {Array.from(
                      { length: board.activeTokens.length },
                      (_, i) =>
                        board.activeTokens[i].boardPosition[0] === colIndex &&
                        board.activeTokens[i].boardPosition[1] == rowIndex && (
                          <div key={i}>
                            <p>{board.activeTokens[i].title}</p>
                          </div>
                        )
                    )}
                  </Box>
                </Grid>
              ))
            )}
          </Grid>
        </>
      )}
    </>
  );
};
export default GameBoard;
