import type { NitroCtx, Feed } from "nuxt-module-feed";
import { createEvent } from "h3";

const BASE_URL = "https://deepin-community.github.io/sig-deepin-ports";

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook("feed:generate", async ({ feed, options }: NitroCtx) => {
    switch (options.path) {
      case "/feed.blog.xml": {
        await generateFeed(feed, "blogs");
        break;
      }
      case "/feed.installdocs.xml": {
        await generateFeed(feed, "installdocs");
        break;
      }
      case "/feed.testdocs.xml": {
        await generateFeed(feed, "testdocs");
        break;
      }
    }
  });
});

const options_base = {
  title: "deepin-ports SIG",
  description: "",
  id: "",
  link: "",
  language: "zh-cn",
  favicon: `${BASE_URL}/icon.svg`,
  copyright: `All rights reserved ${new Date().getFullYear()},`,
  updated: new Date(),
  feedLinks: {
    atom: "",
  },
  author: {
    name: "deepin-ports SIG",
  },
};

export async function generateFeed(feed: Feed, feedtype: string) {
  const options = options_base;
  let prefix = "";
  switch (feedtype) {
    case "blogs": {
      prefix = "blog";
      options.description = "deepin-ports Blog RSS feed";
      break;
    }
    case "testdocs": {
      prefix = "docs";
      options.description = "deepin-ports Install Docs RSS feed";
      options.id = `${BASE_URL}/docs`;
      options.link = `${BASE_URL}/docs`;
      options.feedLinks.atom = `${BASE_URL}/feed.testdocs.xml`;
      break;
    }
    case "installdocs": {
      prefix = "docs";
      options.description = "deepin-ports Test Docs RSS feed";
      options.id = `${BASE_URL}/docs`;
      options.link = `${BASE_URL}/docs`;
      options.feedLinks.atom = `${BASE_URL}/feed.installdocs.xml`;
      break;
    }
  }
  options.id = `${BASE_URL}/${prefix}`;
  options.link = `${BASE_URL}/${prefix}`;
  options.feedLinks.atom = `${BASE_URL}/feed.${feedtype}.xml`;
  feed.options = options;

  const mockEvent = createEvent({
    method: "GET",
    url: "/",
    headers: {},
  });

  const posts = await queryCollection(mockEvent, feedtype)
    .order("date", "DESC")
    .limit(40)
    .all();
  posts.forEach((post) => {
    try {
      const postPath = `${BASE_URL}/${post.stem}/`;
      const articleDate = post.date;
      const formattedDate = new Date(articleDate);
      feed.addItem({
        title: post.title,
        link: postPath,
        id: postPath,
        published: formattedDate,
        date: formattedDate,
        author: [
          {
            name: post.author || "deepin-ports SIG",
          },
        ],
        content: post.description || "暂无简介",
      });
    } catch (error) {
      console.error(`error generating rss feed: `, error);
    }
  });
}
