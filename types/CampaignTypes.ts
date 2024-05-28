import { UserSession } from '@/types/UserTypes';

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
  focusedBoardId: string | null;
}
