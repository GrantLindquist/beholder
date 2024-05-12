// TODO: Look into replacing interfaces w/ classes and including to/from firestore conversion methods
// TODO: Investigate whether having ids in types causes db mismatch
export interface GameBoardBase {
  id: string;
  title: string;
}
export interface GameBoardType extends GameBoardBase {
  width: number;
  height: number;
  backgroundImgURL?: string;
  activeTokens: ActiveGameBoardToken[];
}

export interface GameBoardToken {
  id: string;
  image?: any;
  size?: 'small' | 'medium' | 'large';
  title: string;
  ownerId: string;
  tokenImgURL?: string;
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
  activePlayerIds?: string[];
}
