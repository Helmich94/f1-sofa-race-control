import {useEffect, useState} from "react";
import {
  fetchF1News,
  type NewsArticle,
} from "../../services/newsApi";

function formatPublishedAt(publishedAt: string): string {
  const date = new Date(publishedAt);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("nl-NL", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function NewsCard() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadNews() {
      try {
        const newsArticles = await fetchF1News();

        if (!cancelled) {
          setArticles(newsArticles);
          setError(null);
        }
      } catch (loadError) {
        console.error(loadError);

        if (!cancelled) {
          setError(
            "Actueel F1-nieuws is tijdelijk niet beschikbaar."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadNews();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="dashboard-card news-card">
      <div className="news-card-header">
        <div>
          <span className="dashboard-card-label">
            PADDOCK UPDATE
          </span>

          <h2>Laatste F1-nieuws</h2>
        </div>

        <span className="news-card-status">
          ACTUEEL
        </span>
      </div>

      {loading && (
        <p className="news-card-placeholder">
          Actueel Formule 1-nieuws laden...
        </p>
      )}

      {!loading && error && (
        <p className="news-card-placeholder">
          {error}
        </p>
      )}

      {!loading && !error && (
        <div className="news-list">
          {articles.map((article) => (
            <article
              className="news-item"
              key={article.url}
            >
              <a
                className="news-item-link"
                href={article.url}
                target="_blank"
                rel="noreferrer"
              >
                {article.imageUrl && (
                  <img
                    className="news-item-image"
                    src={article.imageUrl}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                )}

                <div className="news-item-content">
                  <h3>{article.title}</h3>

                  <div className="news-item-meta">
                    <span>{article.source}</span>

                    <span aria-hidden="true">•</span>

                    <time dateTime={article.publishedAt}>
                      {formatPublishedAt(
                        article.publishedAt
                      )}
                    </time>
                  </div>
                </div>

                <span
                  className="news-item-arrow"
                  aria-hidden="true"
                >
                  →
                </span>
              </a>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}