'use client';

import { useState } from 'react';
import {
  DropdownMenuItem,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';

const EditFogOfWar = () => {
  /*
   * true: erasing FOW tiles
   * false: adding FOW tiles
   * null: neither
   */
  const [eraser, setEraser] = useState<boolean | null>(null);

  return (
    <>
      <DropdownMenuLabel>Fog of War</DropdownMenuLabel>
      <DropdownMenuItem>Reveal Cells</DropdownMenuItem>
      <DropdownMenuItem>Hide Cells</DropdownMenuItem>
      <DropdownMenuItem>Reset Fog of War</DropdownMenuItem>
      <DropdownMenuItem>Stop Editing</DropdownMenuItem>
    </>
  );
};
export default EditFogOfWar;
