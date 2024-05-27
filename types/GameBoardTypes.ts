export interface GameBoardBase {
  id: string;
  title: string;
}
export interface GameBoardType extends GameBoardBase {
  width: number;
  height: number;
  backgroundImgURL: string | null;
  activeTokens: ActiveGameBoardToken[];
  settings: GameBoardSettings;
  fowCells: string[];
}

export interface GameBoardToken {
  id: string;
  image?: any;
  size?: 'small' | 'medium' | 'large';
  title: string;
  ownerId: string;
  tokenImgURL: string | null;
  isMonster?: boolean;
  lastPlacedAt?: number;
}

export interface ActiveGameBoardToken extends GameBoardToken {
  boardPosition: [number, number];
  lastMovedAt: number;
  monsterNumber?: number;
  conditions: string[];
}

export interface GameBoardSettings {
  fowEnabled: boolean;
}

export enum SettingsEnum {
  FowEnabled = 'fowEnabled',
}
