import _ from 'lodash';
import { Button } from '@/components/ui/button';
import { useFocusedBoard } from '@/hooks/useFocusedBoard';
import { useCampaign } from '@/hooks/useCampaign';

const GameBoardList = () => {
  const { focusedBoard, setFocusedBoardId } = useFocusedBoard();
  const { campaign } = useCampaign();

  return (
    <>
      {_.map(campaign?.boardIds, (id) => {
        if (id !== focusedBoard?.id) {
          return (
            <div key={id}>
              <Button variant={'outline'} onClick={() => setFocusedBoardId(id)}>
                {id}
              </Button>
            </div>
          );
        }
      })}
    </>
  );
};
export default GameBoardList;
