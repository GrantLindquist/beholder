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
}

export interface CampaignSettings {
  fogOfWarEnabled: boolean;
}

export enum SettingsEnum {
  FogOfWarEnabled = 'fogOfWarEnabled',
}
