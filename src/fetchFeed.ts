import { XMLParser } from "fast-xml-parser";

export async function fetchFeed(feedURL: string) {
  const url = new URL(feedURL);
  const response = await fetch(url, {
    headers: {
      "User-Agent": "gator",
    },
  });
  const text = await response.text();
  const parserObj = new XMLParser();
  const jsObj = await parserObj.parse(text);
  let title: string;
  let link: string;
  let description: string;
  let RSSItem = [];
  if (!jsObj.rss.channel) {
    throw new Error("Channel field is not present in Javascript object");
  }
  if (
    !jsObj.rss.channel.title ||
    !jsObj.rss.channel.link ||
    !jsObj.rss.channel.description
  ) {
    throw new Error("One of channel fiels is missing, cannot proceed");
  } else {
    title = jsObj.rss.channel.title;
    link = jsObj.rss.channel.link;
    description = jsObj.rss.channel.description;
  }
  if (jsObj.rss.channel.item) {
    if (!Array.isArray(jsObj.rss.channel.item)) {
      jsObj.rss.channel.item = [jsObj.rss.channel.item];
    }
    for (const item of jsObj.rss.channel.item) {
      if (item.title && item.link && item.description && item.pubDate) {
        RSSItem.push({
          title: item.title,
          link: item.link,
          description: item.description,
          pubDate: item.pubDate,
        });
      } else {
        continue;
      }
    }
    const channel = { title, link, description, item: RSSItem };
    const finalResult = {
      channel,
    };
    return finalResult;
  } else {
    const channel = { title, link, description, item: [] };
    const finalResult = {
      channel,
    };
    return finalResult;
  }
}
