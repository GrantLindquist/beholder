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

  return (
    <>
      {board && (
        <>
          <h1>{_.get(campaign, 'title')}</h1>
          {/*<Grid*/}
          {/*  id="game_board"*/}
          {/*  maxWidth={board.width * CELL_SIZE}*/}
          {/*  container*/}
          {/*  columns={board.width}*/}
          {/*  sx={{*/}
          {/*    overflow: 'auto',*/}
          {/*    transform: `scale(${props.scale})`,*/}
          {/*  }}*/}
          {/*>*/}
          {/*  {Array.from({ length: board.height }, (__, rowIndex) =>*/}
          {/*    Array.from({ length: board.width }, (__, colIndex) => {*/}
          {/*      const token = board.activeTokens.find(*/}
          {/*        (token) =>*/}
          {/*          token.boardPosition[0] === colIndex &&*/}
          {/*          token.boardPosition[1] === rowIndex*/}
          {/*      );*/}

          {/*      return (*/}
          {/*        <Grid item key={`${rowIndex}-${colIndex}`} xs={1}>*/}
          {/*          <Box*/}
          {/*            sx={{*/}
          {/*              height: CELL_SIZE,*/}
          {/*              width: CELL_SIZE,*/}
          {/*              borderWidth: 1,*/}
          {/*              borderColor: 'grey',*/}
          {/*              borderStyle: 'solid',*/}
          {/*            }}*/}
          {/*            onClick={() =>*/}
          {/*              handleCellClick(token || null, [colIndex, rowIndex])*/}
          {/*            }*/}
          {/*          >*/}
          {/*            {token && <Token token={token} />}*/}
          {/*          </Box>*/}
          {/*        </Grid>*/}
          {/*      );*/}
          {/*    })*/}
          {/*  )}*/}
          {/*</Grid>*/}
        </>
      )}
    </>
  );
};
export default GameBoard;