export default function (articles) {
  return {
    path: articles._path,
    title: articles.title || "no-title available",
    description:
      articles.description || articles.title || "no-description available",
    image: articles.image || "/not-found.jpg",
    alt: articles.alt || "no alter data available",
    date:
      articles.date ||
      articles.gitUpdatedAt ||
      articles.gitCreatedAt ||
      "not-date-available",
    date_created: articles.gitCreatedAt || "not-date-available",
    tags: articles.tags || [],
    author: articles.author || "deepin-ports SIG",
    published: articles.published || false,
  };
}
