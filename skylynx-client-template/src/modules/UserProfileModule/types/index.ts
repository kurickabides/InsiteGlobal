
export interface UserProfileModuleProps {
  userId: string;
  settings: UserProfileModuleSettings;
  onSettingsUpdate: (updated: UserProfileModuleSettings) => void;
}

interface UserProfileModuleSettings{

}