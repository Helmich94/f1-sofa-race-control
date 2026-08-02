import {setGlobalOptions} from "firebase-functions";
import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import {XMLParser} from "fast-xml-parser";

setGlobalOptions({
  maxInstances: 10,
  region: "europe-west1",
});

const NEWS_FEED_URL =
  "https://nl.motorsport.com/rss/f1/news/";

type RssEnclosure = {
  url?: string;
  type?: string;
};

type RssItem = {
  title?: string;
  link?: string;
  pubDate?: string;
  enclosure?: RssEnclosure;
};

type ParsedFeed = {
  rss?: {
    channel?: {
      item?: RssItem | RssItem[];
    };
  };
};

type NewsArticle = {
  title: string;
  url: string;
  publishedAt: string;
  source: string;
  imageUrl?: string;
};

/**
 * Zet een of meerdere RSS-items om naar een array.
 *
 * @param {RssItem | RssItem[] | undefined} items De RSS-items.
 * @return {RssItem[]} Een array met RSS-items.
 */
function normalizeItems(
  items: RssItem | RssItem[] | undefined
): RssItem[] {
  if (!items) {
    return [];
  }

  if (Array.isArray(items)) {
    return items;
  }

  return [items];
}

/**
 * Leest een onbekende waarde uit als opgeschoonde tekst.
 *
 * @param {unknown} value De uit te lezen waarde.
 * @return {string} De tekst of een lege string.
 */
function getText(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

export const f1News = onRequest(
  {
    cors: true,
    timeoutSeconds: 15,
  },
  async (request, response) => {
    if (request.method !== "GET") {
      response.set("Allow", "GET");

      response.status(405).json({
        error: "Alleen GET-verzoeken zijn toegestaan.",
      });

      return;
    }

    try {
      const feedResponse = await fetch(NEWS_FEED_URL, {
        headers: {
          "User-Agent": "F1 Sofa Race Control/1.0",
        },
      });

      if (!feedResponse.ok) {
        throw new Error(
          `Nieuwsfeed antwoordde met ${feedResponse.status}.`
        );
      }

      const xmlText = await feedResponse.text();

      const parser = new XMLParser({
        trimValues: true,
        ignoreAttributes: false,
        attributeNamePrefix: "",
      });

      const parsedFeed =
        parser.parse(xmlText) as ParsedFeed;

      const items = normalizeItems(
        parsedFeed.rss?.channel?.item
      );

      const articles = items
        .map((item): NewsArticle | null => {
          const title = getText(item.title);
          const url = getText(item.link);
          const publishedAt = getText(item.pubDate);
          const imageUrl = getText(
            item.enclosure?.url
          );

          if (!title || !url || !publishedAt) {
            return null;
          }

          const publishedDate = new Date(publishedAt);

          if (Number.isNaN(publishedDate.getTime())) {
            return null;
          }

          return {
            title,
            url,
            publishedAt: publishedDate.toISOString(),
            source: "Motorsport.com",
            imageUrl: imageUrl || undefined,
          };
        })
        .filter(
          (article): article is NewsArticle =>
            article !== null
        )
        .slice(0, 3);

      if (articles.length === 0) {
        throw new Error(
          "De nieuwsfeed bevat geen bruikbare berichten."
        );
      }

      response.set(
        "Cache-Control",
        "public, max-age=300, s-maxage=600"
      );

      response.status(200).json({
        articles,
      });
    } catch (error) {
      logger.error(
        "Ophalen van Formule 1-nieuws is mislukt.",
        error
      );

      response.status(502).json({
        error:
          "Actueel Formule 1-nieuws is tijdelijk niet beschikbaar.",
      });
    }
  }
);