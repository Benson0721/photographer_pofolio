export type Image = {
  public_id: string;
  url: string;
  title: string | null;
};

export type FrontImage = {
  _id: string;
  category: string;
  imageURL: string;
};

export type SectionImage = {
  _id: string;
  public_id: string;
  imageURL: string;
  title: string;
  offsetY: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  type: string;
};

export type CarouselImage = {
  _id: string;
  imageURL: string;
  order: number;
  createdAt: Date;
  public_id: string;
};

export type TopicImage = {
  _id: string;
  category: string;
  topic: string;
  notes: string;
  imageURL: string;
  public_id: string;
  createdAt: Date;
};
export type DisplayImage = {
  _id: string;
  topicID: string;
  imageURL: string;
  public_id: string;
  createdAt: Date;
};

export type AboutImage = {
  public_id: string;
  imageURL: string;
  displayName: string | null;
  offsetY: number;
  _id: string;
};
