export type Post = {
  id: number;
  title: string;
  content: string;
  miniatureUrl: string;
  authorId: string;
  author: {
    id: string;
    name: string;
    role: string;
    profilePictureUrl: string;
  };
  published: boolean;
  lastEditedAt: string;
};

export type Headline = {
  id: number;
  title: string;
  description: string;
  miniatureUrl: string;
  publishingDate: string;
  url: string;
};
