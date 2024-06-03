import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import { ReactNode } from 'react';

// TODO: Fix word breaking
const InfoTooltip = (props: { description: string | ReactNode }) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Info size={16} color="#777" />
      </TooltipTrigger>
      <TooltipContent className="flex max-w-72 break-all">
        {props.description}
      </TooltipContent>
    </Tooltip>
  );
};
export default InfoTooltip;
