import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import {
  DoorOpen,
  EyeOff,
  Pencil,
  Settings,
  SmilePlus,
  Table,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import Link from 'next/link';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import CreateGameBoard from '@/components/sections/forms/CreateGameBoard';
import CreateToken from '@/components/sections/forms/CreateToken';
import TokenList from '@/components/sections/TokenList';
import GameBoardList from '@/components/sections/GameBoardList';
import SettingsMenu from '@/components/sections/SettingsMenu';
import { useCampaign } from '@/hooks/useCampaign';
import { useFocusedBoard } from '@/hooks/useFocusedBoard';
import EditFogOfWar from '@/components/misc/EditFogOfWar';

// TODO: Close sidebar when form (either gameBoard or token) is submitted
const SideNavbar = () => {
  const { isUserDm } = useCampaign();
  const { focusedBoard } = useFocusedBoard();

  return (
    <div className="fixed top-0 left-0 h-screen w-20 flex flex-col items-center bg-gray-900 z-10 p-2">
      <Link href={'/'}>
        <SideNavbarButton title={'Leave Campaign'} icon={<DoorOpen />} />
      </Link>
      <Separator className="my-2 bg-gray-700" />
      <div className="flex-grow">
        {isUserDm && (
          <SideNavbarButton title={'Game Boards'} icon={<Table />}>
            <DropdownMenuLabel>Game Boards</DropdownMenuLabel>
            <GameBoardList />
            <Collapsible>
              <CollapsibleTrigger>
                <DropdownMenuLabel>Create New Board</DropdownMenuLabel>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CreateGameBoard />
              </CollapsibleContent>
            </Collapsible>
          </SideNavbarButton>
        )}

        {focusedBoard && (
          <>
            <SideNavbarButton title={'Game Tokens'} icon={<SmilePlus />}>
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
            </SideNavbarButton>
            <SideNavbarButton
              title={'Paint'}
              icon={<Pencil />}
            ></SideNavbarButton>
          </>
        )}
        <SideNavbarButton title={'Settings'} icon={<Settings />}>
          <DropdownMenuLabel>Settings</DropdownMenuLabel>
          <SettingsMenu />
        </SideNavbarButton>
        {focusedBoard?.settings?.fowEnabled && isUserDm && (
          <>
            <Separator className="my-2 bg-gray-700" />
            <SideNavbarButton title={'Edit Fog of War'} icon={<EyeOff />}>
              <EditFogOfWar />
            </SideNavbarButton>
          </>
        )}
      </div>
      <div className="mb-4">{/*<ActivePlayerList />*/}</div>
      {/* TODO: Create a pending player join request component here */}
    </div>
  );
};
export default SideNavbar;

const SideNavbarButton = ({
  children,
  icon,
  title,
}: {
  children?: ReactNode;
  icon: ReactNode;
  title: string;
}) => {
  const buttonClass = 'bg-gray-700 m-1.5 h-12 hover:bg-purple-800 text-white';
  return (
    <>
      {children ? (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button className={buttonClass}>{icon}</Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <h6 className="font-semibold">{title}</h6>
              </TooltipContent>
            </Tooltip>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="max-w-72 ml-3" side="right">
            <div className="mx-4 my-2">{children}</div>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button className={buttonClass}>{icon}</Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <h6 className="font-semibold">{title}</h6>
          </TooltipContent>
        </Tooltip>
      )}
    </>
  );
};
