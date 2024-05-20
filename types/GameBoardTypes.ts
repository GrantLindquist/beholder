import { UserSession } from '@/types/UserTypes';

export interface GameBoardBase {
  id: string;
  title: string;
}
export interface GameBoardType extends GameBoardBase {
  width: number;
  height: number;
  backgroundImgURL: string | null;
  activeTokens: ActiveGameBoardToken[];
}

export interface GameBoardToken {
  id: string;
  image?: any;
  size?: 'small' | 'medium' | 'large';
  title: string;
  ownerId: string;
  tokenImgURL: string | null;
}

export interface ActiveGameBoardToken extends GameBoardToken {
  boardPosition: [number, number];
  lastMovedAt: number | null;
  isPlayer: boolean;
}

export interface CampaignPreview {
  id: string;
  title: string;
  description?: string;
}

export interface CampaignType extends CampaignPreview {
  boardIds: string[];
  dmId: string;
  playerIds: string[];
  activePlayers?: UserSession[];
}
