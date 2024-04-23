'use client';

import { GameBoardCellType, GameBoardType } from '@/types/GameBoardTypes';
import { doc, onSnapshot } from '@firebase/firestore';
import { useEffect, useState } from 'react';
import db from '@/app/firebase';
import { CELL_SIZE } from '@/app/globals';
import { Grid } from '@mui/material';
import GameBoardCell from '@/components/GameBoardCell';
import _ from 'lodash';

const GameBoard = (props: { scale: number; boardIds: string[] }) => {
  const [board, setBoard] = useState<GameBoardType | null>(null);

  // Subscribe to receive live board updates
  // TODO: Add support for multiple boards
  useEffect(() => {
    if (_.size(props.boardIds) > 0) {
      const docRef = doc(db, 'game_boards', props.boardIds[0]);
      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          setBoard(docSnap.data() as GameBoardType);
        } else {
          console.log('No such document!');
        }
      });
      // Cleanup
      return () => {
        unsubscribe();
      };
    }
  }, [props.boardIds]);

  return (
    <>
      {board ? (
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
      ) : (
        <p>There are no boards! Create one loser.</p>
      )}
    </>
  );
};
export default GameBoard;
