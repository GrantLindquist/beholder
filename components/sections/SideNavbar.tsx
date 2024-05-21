import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { DoorOpen, Pencil, Settings, SmilePlus, Table } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import ActivePlayerList from '@/components/sections/ActivePlayerList';
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

// TODO: Close sidebar when form (either gameBoard or token) is submitted
const SideNavbar = () => {
  return (
    <div className="fixed top-0 left-0 h-screen w-20 flex flex-col items-center bg-gray-900 shadow-lg p-2">
      <Link
        href={'/'}
        className="bg-gray-700 m-1.5 h-12 hover:bg-purple-800 flex items-center justify-center"
      >
        <DoorOpen />
      </Link>
      <Separator className="my-2 bg-gray-700" />
      <div className="flex-grow">
        <SideNavbarIcon title={'Game Boards'} icon={<Table />}>
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
        </SideNavbarIcon>

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
        <SideNavbarIcon title={'Settings'} icon={<Settings />}>
          <DropdownMenuLabel>Settings</DropdownMenuLabel>
          <SettingsMenu />
        </SideNavbarIcon>
      </div>
      <div className="mb-4">
        <ActivePlayerList />
      </div>
    </div>
  );
};
export default SideNavbar;

// TODO: Revise this to be a normal button if children is not defined
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
        <Tooltip>
          <TooltipTrigger asChild>
            <Button className="bg-gray-700 m-1.5 h-12 hover:bg-purple-800 text-white">
              {icon}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <h6 className="font-semibold">{title}</h6>
          </TooltipContent>
        </Tooltip>
      </DropdownMenuTrigger>
      {children && (
        <DropdownMenuContent className="max-w-72" side="right">
          <div className="mx-4 my-2">{children}</div>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
};
