import { Box } from '@mui/material';
import _ from 'lodash';
import { CELL_SIZE } from '@/app/globals';
import { GameBoardCellType } from '@/types/GameBoardTypes';

export default function GameBoardCell(props: { cell: GameBoardCellType }) {
  return (
    <Box
      sx={{
        height: CELL_SIZE,
        width: CELL_SIZE,
        borderWidth: 1,
        borderColor: 'grey',
        borderStyle: 'solid',
      }}
    >
      {_.size(props.cell.occupants) > 0 && <p>1</p>}
    </Box>
  );
}
