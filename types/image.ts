type ImageInfo = {
  type: string;
  size: string;
  device: string;
  date: string;
  link: string;
  tags?: string[];
};

type ImageLabel = {
  title: string;
  color: string;
};

type ImageLabelList = {
  tags: Record<string, ImageLabel>;
  types: Record<string, ImageLabel>;
};

export type { ImageInfo, ImageLabelList };
