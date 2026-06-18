export interface RSSSource {
  name: string;
  url: string;
  siteUrl: string;
}

export const RSS_SOURCES: RSSSource[] = [
  {
    name: "TechCrunch",
    url: "https://techcrunch.com/feed/",
    siteUrl: "https://techcrunch.com",
  },
  {
    name: "The Verge",
    url: "https://www.theverge.com/rss/index.xml",
    siteUrl: "https://www.theverge.com",
  },
  {
    name: "Engadget",
    url: "https://www.engadget.com/rss.xml",
    siteUrl: "https://www.engadget.com",
  },
  {
    name: "Android Central",
    url: "https://www.androidcentral.com/feed",
    siteUrl: "https://www.androidcentral.com",
  },
  {
    name: "MacRumors",
    url: "https://feeds.macrumors.com/MacRumors-All",
    siteUrl: "https://www.macrumors.com",
  },
];
