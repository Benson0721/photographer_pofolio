export type Image = {
  public_id: string;
  url: string;
  title: string | null;
};

export type SectionImage = {
  _id: string;
  public_id: string;
  url: string;
  title: string | null;
};

export type CarouselImage = {
  _id: string;
  imageURL: string;
  order: number;
  createdAt: Date;
};
