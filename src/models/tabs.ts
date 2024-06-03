export interface ITab {
  id: number;
  name: string;
  icon: string;
  path?: string;
  pinned?: boolean;
  active?: boolean;
}
