'use client';

import { GameBoardCellType, GameBoardType } from '@/types/GameBoardTypes';
import { doc, onSnapshot } from '@firebase/firestore';
import { useEffect, useState } from 'react';
import db from '@/app/firebase';
import { CELL_SIZE } from '@/app/globals';
import { Grid } from '@mui/material';
import GameBoardCell from '@/components/sections/GameBoardCell';
import _ from 'lodash';
import { useCampaign } from '@/hooks/useCampaign';

const GameBoard = (props: { scale: number; boardId: string }) => {
  const [board, setBoard] = useState<GameBoardType>();
  const { campaign } = useCampaign();

  // Subscribe to receive live board updates
  useEffect(() => {
    const docRef = doc(db, 'game_boards', props.boardId);
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
            {_.map(
              Object.entries(_.get(board, 'cells')),
              (cell: GameBoardCellType, index: number) => (
                <Grid item key={index} xs={1}>
                  <GameBoardCell cell={cell} />
                </Grid>
              )
            )}
          </Grid>
        </>
      )}
    </>
  );
};
export default GameBoard;
