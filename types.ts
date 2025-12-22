
export interface TreeData {
  t: string;       // Topper
  c: string;       // Content
  h: number[];     // Highlighted indices
  s?: number;      // Style index
}

export interface TreeChar {
  char: string;
  index: number;
  isHighlight: boolean;
}

export type TreeRow = TreeChar[];
