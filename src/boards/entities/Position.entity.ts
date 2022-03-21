export interface Design {
  userId: object;
  behanceUrl: string | null;
  skills: Array<[string, number, number]> | null;
  portfolioUrl: Array<string> | null;
  _id: object;
}

export interface Dev {
  userId: object;
  gitUrl: string;
  bojUrl: string;
  ability: Array<[string, number, number]> | null;
  skills: Array<[string, number, number]> | null;
  portfolioUrl: Array<string> | null;
  _id: object;
}
