'use client';

import { ActiveGameBoardToken } from '@/types/GameBoardTypes';
import { useState } from 'react';
import { useFocusedBoard } from '@/hooks/useFocusedBoard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import _ from 'lodash';

const ConditionList = (props: { token: ActiveGameBoardToken }) => {
  const { updateToken } = useFocusedBoard();
  const [isAdding, setIsAdding] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState<string | null>(
    null
  );

  // TODO: Something weird is happening here. Maybe a race condition? Or perhaps optimistic bug?
  const handleAddCondition = async (event: any) => {
    event.preventDefault();
    let newConditions = props.token.conditions || [];
    newConditions.push(event.target[0].value);

    console.log(newConditions);

    await updateToken(props.token, {
      conditions: newConditions,
    });

    setIsAdding(false);
  };

  const handleDeleteCondition = async (condition: string) => {
    let newConditions =
      props.token.conditions.filter((c) => c !== condition) || [];

    await updateToken(props.token, {
      conditions: newConditions,
    });

    setSelectedCondition(null);
  };

  return (
    <div className="m-2">
      {_.size(props.token.conditions) > 0 ? (
        <div className="space-y-1 my-2">
          {props.token.conditions.map((condition) => (
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
