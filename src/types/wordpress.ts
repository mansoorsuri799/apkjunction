export interface RankMathMeta {
  title: string;
  description: string;
  focus_keyword: string;
  rich_snippet?: string;
}

export interface WPPost {
  id: number;
  slug: string;
  date: string;
  modified: string;
  link: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  featured_media: number;
  categories: number[];
  rank_math?: RankMathMeta;
  _embedded?: {
    "wp:featuredmedia"?: WPMedia[];
    "wp:term"?: [WPCategory[], WPTag[]];
    author?: WPAuthor[];
  };
}

export interface WPMedia {
  id: number;
  source_url: string;
  alt_text: string;
  media_details?: {
    width: number;
    height: number;
  };
}

export interface WPCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
}

export interface WPTag {
  id: number;
  name: string;
  slug: string;
}

export interface WPAuthor {
  id: number;
  name: string;
  slug: string;
}
