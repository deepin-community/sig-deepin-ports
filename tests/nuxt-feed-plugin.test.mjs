import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { after, before, test } from "node:test";

const require = createRequire(import.meta.url);
const feedRequire = createRequire(require.resolve("nuxt-module-feed"));
const { Feed } = feedRequire("feed");
const baseUrl = "https://deepin-community.github.io/sig-deepin-ports";
const originalPlugin = globalThis.defineNitroPlugin;
const originalQuery = globalThis.queryCollection;
let generateFeed;

before(async () => {
  globalThis.defineNitroPlugin = (plugin) => plugin;
  globalThis.queryCollection = (_event, collection) => {
    const query = {
      order: () => query,
      limit: () => query,
      all: async () => [{
        title: collection,
        stem: `docs/${collection}/example`,
        date: "2026-01-01",
        bodyHtml: `<p>${collection}</p>`,
      }],
    };
    return query;
  };
  ({ generateFeed } = await import("../server/plugins/nuxt-feed-plugin.ts"));
});

after(() => {
  if (originalPlugin === undefined) delete globalThis.defineNitroPlugin;
  else globalThis.defineNitroPlugin = originalPlugin;
  if (originalQuery === undefined) delete globalThis.queryCollection;
  else globalThis.queryCollection = originalQuery;
});

function newFeed() {
  return new Feed({ title: "test", id: baseUrl, copyright: "test" });
}

function assertSelfLink(feed, collection) {
  assert.match(
    feed.atom1(),
    new RegExp(`rel="self" href="${baseUrl}/feed\\.${collection}\\.xml"`),
  );
}

for (const collections of [
  ["installdocs", "testdocs"],
  ["testdocs", "installdocs"],
]) {
  test(`concurrent ${collections.join(" / ")} feeds retain their own metadata`, async () => {
    const feeds = collections.map(newFeed);
    await Promise.all(feeds.map((feed, index) => generateFeed(feed, collections[index])));

    feeds.forEach((feed, index) => {
      assertSelfLink(feed, collections[index]);
      assert.equal(feed.items[0].title, collections[index]);
      assert.equal(feed.items.length, 1);
    });
  });
}

test("generating another feed leaves previously generated metadata unchanged", async () => {
  const first = newFeed();
  await generateFeed(first, "installdocs");
  const xml = first.atom1();

  await generateFeed(newFeed(), "testdocs");

  assert.equal(first.atom1(), xml);
});

test("a blog keeps its own id when a documentation feed is generated concurrently", async () => {
  const blog = newFeed();
  await Promise.all([
    generateFeed(blog, "blogs"),
    generateFeed(newFeed(), "testdocs"),
  ]);

  assert.equal(blog.options.id, `${baseUrl}/blog`);
  assert.equal(blog.options.link, `${baseUrl}/blog`);
  assert.equal(blog.items[0].title, "blogs");
});

test("a single documentation feed retains its endpoint and content", async () => {
  const feed = newFeed();
  await generateFeed(feed, "installdocs");

  assertSelfLink(feed, "installdocs");
  assert.equal(feed.items[0].title, "installdocs");
});
