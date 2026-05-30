export type SearchCategory =
  | 'Blogs'
  | 'Projects'
  | 'Project Ideas'
  | 'Certificates'
  | 'Experience'
  | 'Education';

export interface SearchResultItem {
  category: SearchCategory;
  title: string;
  route: string; // router link string (e.g. /blogs/:slug)
  slug: string;
  snippet: string;
  date?: string;
  score: number;
}

export interface SearchResultGroup {
  category: SearchCategory;
  results: SearchResultItem[];
}

