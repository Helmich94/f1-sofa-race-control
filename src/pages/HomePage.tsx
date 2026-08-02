import Header from "../components/home/Header";
import CountdownCard from "../components/home/CountdownCard";
import PredictionCard from "../components/home/PredictionCard";
import PoolsCard from "../components/home/PoolsCard";
import NewsCard from "../components/home/NewsCard";

import "../styles/home.css";

export default function HomePage() {
  return (
    <main className="home-page">
      <Header />

<div className="home-content">
  <CountdownCard />

 <div className="dashboard-grid">
    <PredictionCard />
    <PoolsCard />
  </div>

  <NewsCard />
</div>
    </main>
  );
}