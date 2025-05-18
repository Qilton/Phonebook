export interface Contact {
  _id: string;
  name: string;
  email?: string;
  createdAt: string;
  lastContacted?: string;
  notes?: string;
  tags?: string[];
  number: string;
  blocked: boolean;
  favourite: boolean;
}

export type SortOption = 'name' | 'dateAdded' | 'lastContacted';
export type FilterOption = 'all' | 'blocked' | 'favorites' | 'recent';