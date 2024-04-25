// TODO: Investigate whether having ids in types causes db mismatch
export interface GameBoardType {
  id: string;
  title: string;
  width: number;
  height: number;
  activeTokens: GameBoardToken[];
}

// TODO: Implement movedAt attribute to detect which token to display when multiple occupy a cell
export interface GameBoardToken {
  id: string;
  image?: any;
  size?: 'small' | 'medium' | 'large';
  title: string;
  ownerId: string;
  isPlayer: boolean;
  boardPosition: [number, number] | null;
}

export interface CampaignType {
  id: string;
  title: string;
  boardIds: string[];
  dmId: string;
  playerIds: string[];
}
