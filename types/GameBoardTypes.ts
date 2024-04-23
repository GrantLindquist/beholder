export interface GameBoardTypes {
  width: number;
  height: number;
  cells: GameBoardCellType[];
}

export interface GameBoardCellType {
  occupants: string[];
}
