import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import _ from 'lodash';

const ConditionBadge = (props: { conditions: string[] }) => {
  return (
    <div className="absolute top-0 right-0 z-10">
      <Tooltip>
        <TooltipTrigger>
          <div className="border-2 border-white size-5 flex items-center justify-center rounded-full bg-black">
            <p className="text-xs mx-1">{_.size(props.conditions)}</p>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="italic">
            {props.conditions.map(
              (condition, index) =>
                `${condition}${index < _.size(props.conditions) - 1 ? ', ' : ''}`
            )}
          </p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};
export default ConditionBadge;
