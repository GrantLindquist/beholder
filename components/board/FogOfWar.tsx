'use client';

import { useFocusedBoard } from '@/hooks/useFocusedBoard';
import { useEffect } from 'react';
import { useCampaign } from '@/hooks/useCampaign';

const FogOfWar = () => {
  const { focusedBoard } = useFocusedBoard();
  const { isUserDm } = useCampaign();

  useEffect(() => {
    const fogOfWar = document.querySelector('#fog-of-war');
    if (fogOfWar && focusedBoard) {
      // @ts-ignore
      fogOfWar.style.gridTemplateColumns = `repeat(${focusedBoard.width}, minmax(0, 1fr))`;
    }
  }, [focusedBoard?.width]);

  return (
    <>
      {focusedBoard && (
        <div id="fog-of-war" className="absolute">
          {Array.from({ length: focusedBoard.height }, (__, rowIndex) =>
            Array.from({ length: focusedBoard.width }, (__, colIndex) => {
              return (
                <div
                  key={`fow-${colIndex},${rowIndex}`}
                  className={`size-12 bg-black z-50 pointer-events-none ${isUserDm ? 'bg-opacity-70' : 'border-2 border-black'}`}
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
