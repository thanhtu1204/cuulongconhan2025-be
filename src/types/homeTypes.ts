export type ClassType = 'cb' | 'tl' | 'vd' | 'll' | 'bc' | 'mg';

export interface ClassDetailType {
  id: number;
  description: string;
  class: ClassType;
  video: string;
  textImage: string;
}

export interface IRank {
  unique_id: number;
  chr_name: string;
  inner_level: number;
  jin: string;
  gong: number;
  party: number;
  class: number;
  honor: number;
  hiding: number;
  money: number;
  level_rate: number;
  levelup_time: number;
}

export interface INews {
  news_id: number;
  news_title: string;
  news_ascii: string;
  news_images: string;
  type: number;
  news_descriptions: string;
  news_content: string;
  created_at: number;
  create_by?: string;
  delete_flag?: boolean;
}

export interface INewsList {
  news: INews[];
}

export interface HomeState {
  news: INews[];
  linkDownLoad: { link: ILinkDownload };
  guideData: any;
  loading: boolean;
}

export interface ILinkDownload {
  vi: string;
  en: string;
}

export interface IAllPromotions {
  data: any;
}
