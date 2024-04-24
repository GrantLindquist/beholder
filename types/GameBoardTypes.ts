export interface GameBoardType {
  id: string;
  title: string;
  width: number;
  height: number;
  cells: GameBoardCellType[];
  activeTokenIds: string[];
}

export interface GameBoardCellType {
  occupants: string[];
  isDisabled?: boolean;
}

export interface GameBoardToken {
  id: string;
  image?: any;
  size?: 'small' | 'medium' | 'large';
  title: string;
  ownerId: string;
  isPlayer: boolean;
}

export interface CampaignType {
  id: string;
  title: string;
  boardIds: string[];
  dmId: string;
  playerIds: string[];
}
