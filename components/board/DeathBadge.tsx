import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Skull } from 'lucide-react';

const DeathBadge = () => {
  return (
    <div className="absolute top-0 right-0 z-10">
      <Tooltip>
        <TooltipTrigger>
          <Skull />
        </TooltipTrigger>
        <TooltipContent>
          <p className="italic">Dead</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};
export default DeathBadge;
