export interface GameBoardType {
  id: string;
  title: string;
  width: number;
  height: number;
  cells: GameBoardCellType[];
}

export interface GameBoardCellType {
  occupants: string[];
  is_disabled?: boolean;
}

export interface CampaignType {
  id: string;
  title: string;
  board_ids: string[];
  dm_id: string;
  player_ids: string[];
}
