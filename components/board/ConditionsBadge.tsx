import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import _ from 'lodash';

const ConditionsBadge = (props: { conditions: string[] }) => {
  return (
    <div className="absolute top-0 right-0">
      <Tooltip>
        <TooltipTrigger>
          <div className="border-2 border-white rounded-full bg-black">
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
export default ConditionsBadge;
