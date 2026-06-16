export interface Location {
  id: string;
  name: string;
  description: string | null;
  parent_id: string | null;
}

export interface LocationCreate {
  name: string;
  description?: string | null;
}
