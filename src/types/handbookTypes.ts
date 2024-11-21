export type HandbookType = 'tt' | 'nv' | 'tb' | 'pb' | 'tn';

export interface HandbookDetailType {
  id: number;
  description: string;
  class: HandbookType;
  textImage: string;
  content: string[];
  hasDropdown: false;
}
