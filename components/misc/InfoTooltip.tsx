import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import { ReactNode } from 'react';

// TODO: Fix weird spacing
const InfoTooltip = (props: { description: string | ReactNode }) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Info size={16} color="#777" />
      </TooltipTrigger>
      <TooltipContent className="flex max-w-72">
        {props.description}
      </TooltipContent>
    </Tooltip>
  );
};
export default InfoTooltip;
