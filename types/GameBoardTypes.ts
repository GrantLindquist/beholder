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
  isMonster?: boolean;
}

export interface ActiveGameBoardToken extends GameBoardToken {
  boardPosition: [number, number];
  lastMovedAt: number;
  monsterNumber?: number;
}
