import type { ImageInfo } from "~/types/image";

const fetchimglist = async (arch: string) => {
  const dataurl = `https://deepin-community.github.io/sig-deepin-ports-images/images-${arch}.json`;
  const latestitem: Map<string, ImageInfo> = new Map();

  const response = await fetch(dataurl);
  let data: ImageInfo[] = await response.json();

  for (const i of data) {
    const j = latestitem.get(i.device);
    if (j) {
      if (i.date > j.date) latestitem.set(i.device, i);
    } else latestitem.set(i.device, i);
  }
  data = data.map((i) => {
    if (latestitem.get(i.device)?.date == i.date) i["tags"] = ["latest"];
    return i;
  });

  return data;
};

export { fetchimglist };
