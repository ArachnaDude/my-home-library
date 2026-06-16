export interface Author {
  id: string;
  display_name: string;
  first_name: string | null;
  last_name: string | null;
}

export interface AuthorCreate {
  display_name: string;
  first_name?: string | null;
  last_name?: string | null;
}
