export interface ILesson {
  title: string;
  content: string;
  duration: number;
  videoUrl: string;
  attachements: string[];
}

export interface ICategory {
  title: string;
  color: string;
}

export interface IDetail {
  lang: string;
  status: string;
  skill: string;
  why: string[];
}

export interface IPrice {
  regular: number;
  discount: number;
  free: boolean;
}
