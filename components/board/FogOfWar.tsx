'use client';

import { useFocusedBoard } from '@/hooks/useFocusedBoard';
import { useEffect, useState } from 'react';
import { useCampaign } from '@/hooks/useCampaign';
import { useFow } from '@/hooks/useFow';
import _ from 'lodash';
import db from '@/app/firebase';
import { arrayRemove, arrayUnion, doc, updateDoc } from '@firebase/firestore';
import { CELL_SIZE } from '@/app/globals';

const FogOfWar = () => {
  const { focusedBoard } = useFocusedBoard();
  const { isUserDm } = useCampaign();
  const { eraseFow } = useFow();

  const [mouseDown, setMouseDown] = useState(false);

  useEffect(() => {
    const fogOfWar = document.querySelector('#fog-of-war');
    if (fogOfWar && focusedBoard) {
      const columns = `repeat(${focusedBoard.width}, minmax(${CELL_SIZE}px, ${CELL_SIZE}px))`;
      const rows = `repeat(${focusedBoard.height}, minmax(${CELL_SIZE}px, ${CELL_SIZE}px))`;
      // @ts-ignore
      fogOfWar.style.gridTemplateColumns = columns;
      // @ts-ignore
      fogOfWar.style.gridTemplateRows = rows;
    }
  }, [focusedBoard?.width]);

  const handleUpdateFow = async (
    erase: boolean,
    colIndex: number,
    rowIndex: number
  ) => {
    if (focusedBoard) {
      await updateDoc(doc(db, 'gameBoards', focusedBoard.id), {
        fowCells: erase
          ? arrayRemove(`${colIndex},${rowIndex}`)
          : arrayUnion(`${colIndex},${rowIndex}`),
      });
    }
  };

  // TODO: Size-full makes FOW disappear?
  return (
    <>
      {focusedBoard && (
        <div id="fog-of-war" className="absolute">
          {Array.from({ length: focusedBoard.height }, (__, rowIndex) =>
            Array.from({ length: focusedBoard.width }, (__, colIndex) => {
              return (
                <div
                  key={`fow-${colIndex},${rowIndex}`}
                  className={`size-full ${focusedBoard.fowCells?.includes(`${colIndex},${rowIndex}`) ? 'bg-black' : ''}  z-50 ${_.isNull(eraseFow) ? 'pointer-events-none' : ''} ${isUserDm ? 'bg-opacity-70' : 'border-2 border-black'} ${eraseFow ? 'cursor-erase' : ''} ${eraseFow === false ? 'cursor-draw' : ''}`}
                  onMouseOver={() =>
                    !_.isNull(eraseFow) &&
                    mouseDown &&
                    handleUpdateFow(eraseFow, colIndex, rowIndex)
                  }
                  onMouseDown={() => setMouseDown(true)}
                  onMouseUp={() => setMouseDown(false)}
                  onDragStart={(event) => event.preventDefault()}
                ></div>
              );
            })
          )}
        </div>
      )}
    </>
  );
};
export default FogOfWar;
