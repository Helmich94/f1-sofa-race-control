export type NewsArticle = {
  title: string;
  url: string;
  publishedAt: string;
  source: string;
  imageUrl?: string;
};

type NewsResponse = {
  articles?: NewsArticle[];
  error?: string;
};

export async function fetchF1News(): Promise<NewsArticle[]> {
  const response = await fetch("/api/f1-news");

  let data: NewsResponse;

  try {
    data = (await response.json()) as NewsResponse;
  } catch {
    throw new Error(
      "De nieuwsserver gaf geen geldig antwoord."
    );
  }

  if (!response.ok) {
    throw new Error(
      data.error ??
        "Het Formule 1-nieuws kon niet worden opgehaald."
    );
  }

  if (
    !Array.isArray(data.articles) ||
    data.articles.length === 0
  ) {
    throw new Error(
      "Er zijn momenteel geen nieuwsberichten beschikbaar."
    );
  }

  return data.articles;
}

