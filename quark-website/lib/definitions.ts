export type Post = {
  id: number;
  title: string;
  content: string;
  miniature: string;
  authorId: string;
  published: boolean;
  lastEditedAt: Date;
};

export enum Published {
  ALL,
  PUBLISHED,
  ARCHIVED,
}
