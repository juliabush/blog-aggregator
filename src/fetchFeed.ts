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
  let itemTitle = [];
  let itemLink = [];
  let itemDescription = [];
  let itemPubDate = [];
  if (!jsObj.channel) {
    throw new Error("Channel field is not present in Javascript object");
  }
  if (
    !jsObj.channel.title ||
    !jsObj.channel.link ||
    !jsObj.channel.description
  ) {
    throw new Error("One of channel fiels is missing, cannot proceed");
  } else {
    title = jsObj.channel.title;
    link = jsObj.channel.link;
    description = jsObj.channel.description;
  }
  if (jsObj.channel.item) {
    if (!Array.isArray(jsObj.channel.item)) {
      jsObj.channel.item = [];
    }
    for (const item of jsObj.channel.item) {
      itemTitle.push(item.title);
      itemLink.push(item.link);
      itemDescription.push(item.description);
      itemPubDate.push(item.pubDate);
    }
    const finalResult = {
      title,
      link,
      description,
      itemTitle,
      itemLink,
      itemDescription,
      itemPubDate,
    };
    return finalResult;
  } else {
    throw new Error("No items present");
  }
}
