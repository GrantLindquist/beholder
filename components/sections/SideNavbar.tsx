import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { DoorOpen, Pencil, SmilePlus, Table } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useCampaign } from '@/hooks/useCampaign';
import ActivePlayerList from '@/components/sections/ActivePlayerList';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import Link from 'next/link';
import _ from 'lodash';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import CreateGameBoard from '@/components/sections/forms/CreateGameBoard';
import CreateToken from '@/components/sections/forms/CreateToken';
import TokenList from '@/components/sections/TokenList';
import { useFocusedBoard } from '@/hooks/useFocusedBoard';

// TODO: Close sidebar when form (either gameBoard or token) is submitted
const SideNavbar = () => {
  const { isUserDm, campaign } = useCampaign();
  const { focusedBoard, setFocusedBoardId } = useFocusedBoard();

  return (
    <div className="fixed top-0 left-0 h-screen w-20 flex flex-col bg-stone-900 shadow-lg p-2">
      <Link
        href={'/'}
        className="bg-stone-800 m-1.5 h-12 hover:bg-purple-800 flex items-center justify-center"
      >
        <DoorOpen />
      </Link>
      <Separator className="my-2 bg-stone-600" />
      {isUserDm && (
        <>
          <SideNavbarIcon title={'Game Boards'} icon={<Table />}>
            <DropdownMenuLabel>Game Boards</DropdownMenuLabel>
            {_.map(campaign?.boardIds, (id) => {
              if (id !== focusedBoard?.id) {
                return (
                  <div key={id}>
                    <Button
                      variant={'outline'}
                      onClick={() => setFocusedBoardId(id)}
                    >
                      {id}
                    </Button>
                  </div>
                );
              }
            })}
            <Collapsible>
              <CollapsibleTrigger>
                <DropdownMenuLabel>Create New Board</DropdownMenuLabel>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CreateGameBoard />
              </CollapsibleContent>
            </Collapsible>
          </SideNavbarIcon>
        </>
      )}

      <SideNavbarIcon title={'Game Tokens'} icon={<SmilePlus />}>
        <DropdownMenuLabel>Your Tokens</DropdownMenuLabel>
        <TokenList />
        <Collapsible>
          <CollapsibleTrigger>
            <DropdownMenuLabel>Create New Token</DropdownMenuLabel>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CreateToken />
          </CollapsibleContent>
        </Collapsible>
      </SideNavbarIcon>
      <SideNavbarIcon title={'Paint'} icon={<Pencil />}></SideNavbarIcon>
      <div className="bottom-0">
        <ActivePlayerList />
      </div>
    </div>
  );
};
export default SideNavbar;

const SideNavbarIcon = ({
  children,
  icon,
  title,
}: {
  children?: ReactNode;
  icon: ReactNode;
  title: string;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <TooltipProvider delayDuration={500}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button className="bg-stone-800 m-1.5 h-12 hover:bg-purple-800">
                {icon}
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-stone-800" side="right">
              <h6 className="font-semibold">{title}</h6>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DropdownMenuTrigger>
      {children && (
        <DropdownMenuContent side="right">{children}</DropdownMenuContent>
      )}
    </DropdownMenu>
  );
};
