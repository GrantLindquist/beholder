'use client';

import { ActiveGameBoardToken } from '@/types/GameBoardTypes';
import { useEffect, useState } from 'react';
import { useFocusedBoard } from '@/hooks/useFocusedBoard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import _ from 'lodash';
import { arrayRemove, arrayUnion, doc, updateDoc } from '@firebase/firestore';
import db from '@/app/firebase';

const ConditionList = (props: { token: ActiveGameBoardToken }) => {
  const { focusedBoard } = useFocusedBoard();
  const [conditions, setConditions] = useState<string[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (focusedBoard) {
      const viewedToken = focusedBoard?.activeTokens.find(
        (t) => t.id === props.token.id
      );
      setConditions(viewedToken?.conditions ?? []);
    }
  }, [props.token.id]);

  const handleAddCondition = async (event: any) => {
    event.preventDefault();
    let newConditions = conditions;
    newConditions.push(event.target[0].value);

    if (focusedBoard) {
      // TODO: Create an optimistic update utility to handle this better (or find a better way to update tokens)
      const docRef = doc(db, 'gameBoards', focusedBoard.id);
      await updateDoc(docRef, {
        activeTokens: arrayRemove(props.token),
      });

      await updateDoc(docRef, {
        activeTokens: arrayUnion({
          ...props.token,
          conditions: newConditions,
        }),
      });
    }

    setIsAdding(false);
  };

  const handleDeleteCondition = async (condition: string) => {
    let newConditions = conditions.filter((c) => c !== condition);

    if (focusedBoard) {
      // TODO: Create an optimistic update utility to handle this better (or find a better way to update tokens)
      const docRef = doc(db, 'gameBoards', focusedBoard.id);
      await updateDoc(docRef, {
        activeTokens: arrayRemove(props.token),
      });

      await updateDoc(docRef, {
        activeTokens: arrayUnion({
          ...props.token,
          conditions: newConditions,
        }),
      });
    }

    setSelectedCondition(null);
  };

  return (
    <div className="m-2">
      {_.size(conditions) > 0 ? (
        <div className="space-y-1 my-2">
          {conditions.map((condition) => (
            <div
              key={`${props.token.id}-${condition}}`}
              className={`${condition === selectedCondition ? 'bg-gray-800' : ''} text-sm rounded hover:bg-gray-800`}
              onClick={() => setSelectedCondition(condition)}
            >
              <p className="cursor-pointer m-2">{condition}</p>
            </div>
          ))}
        </div>
      ) : (
        <>
          <p className="text-xs italic text-gray-500">No current conditions</p>
        </>
      )}

      {isAdding ? (
        <form onSubmit={handleAddCondition} className="m-2">
          <div className="flex flex-row items-center space-x-2">
            <Input placeholder="e.g. Paralyzed" />
            <Button type="submit">Add</Button>
          </div>
        </form>
      ) : (
        <div className="flex flex-row items-center space-x-1">
          <Button onClick={() => setIsAdding(true)}>Add</Button>
          <Button
            disabled={_.isNull(selectedCondition)}
            variant="secondary"
            onClick={() =>
              selectedCondition && handleDeleteCondition(selectedCondition)
            }
          >
            Delete
          </Button>
        </div>
      )}
    </div>
  );
};
export default ConditionList;
