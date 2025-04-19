
export interface FontFile {
  [key: string]: string;
}

export interface FontData {
  family: string;
  variants: string[];
  subsets: string[];
  version: string;
  lastModified: string;
  files: FontFile;
  category: string;
  kind: string;
  menu: string;
}

export interface FontsResponse {
  kind: string;
  items: FontData[];
}
