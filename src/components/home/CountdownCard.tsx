import { useEffect, useState } from "react";
import { fetchNextRace } from "../../services/f1Api";
import ReactCountryFlag from "react-country-flag";
import { countryCodes } from "../../utils/countryCodes";
import { circuitImages } from "../../utils/circuitImages";
import { circuitInfo } from "../../utils/circuitInfo";

type RaceData = Awaited<ReturnType<typeof fetchNextRace>>;

type SessionItem = {
  name: string;
  date: string;
  time: string;
};

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
};

type SessionSnapshot = {
  session: SessionItem | null;
  targetTimestamp: number | null;
  timeLeft: TimeLeft;
  sessionLive: boolean;
};

const initialSessionSnapshot: SessionSnapshot = {
  session: null,
  targetTimestamp: null,
  timeLeft: {
    days: 0,
    hours: 0,
    minutes: 0,
  },
  sessionLive: false,
};

function getSessionDuration(name: string): number {
  const durations: Record<string, number> = {
    FP1: 60,
    FP2: 60,
    FP3: 60,
    SPRINTKWALIFICATIE: 45,
    SPRINT: 30,
    KWALIFICATIE: 60,
    RACE: 180,
  };

  return durations[name.toUpperCase()] ?? 60;
}

function getNextSession(
  race: RaceData,
  now: number
): SessionItem | null {
  const sessions: SessionItem[] = [
    race.firstPractice && {
      name: "FP1",
      ...race.firstPractice,
    },
    race.secondPractice && {
      name: "FP2",
      ...race.secondPractice,
    },
    race.thirdPractice && {
      name: "FP3",
      ...race.thirdPractice,
    },
    race.sprintQualifying && {
      name: "Sprintkwalificatie",
      ...race.sprintQualifying,
    },
    race.sprint && {
      name: "Sprint",
      ...race.sprint,
    },
    race.qualifying && {
      name: "Kwalificatie",
      ...race.qualifying,
    },
    {
      name: "Race",
      date: race.date,
      time: race.time,
    },
  ].filter((session): session is SessionItem => Boolean(session));

  return (
    sessions
      .map((session) => {
        const start = new Date(
          `${session.date}T${session.time}`
        ).getTime();

        const duration = getSessionDuration(session.name);
        const end = start + duration * 60 * 1000;

        return {
          ...session,
          start,
          end,
        };
      })
      .filter((session) => session.end > now)
      .sort((a, b) => a.start - b.start)[0] ?? null
  );
}

function createSessionSnapshot(
  race: RaceData,
  now: number
): SessionSnapshot {
  const session = getNextSession(race, now);

  if (!session) {
    return initialSessionSnapshot;
  }

  const targetTimestamp = new Date(
    `${session.date}T${session.time}`
  ).getTime();

  const duration = getSessionDuration(session.name);
  const endTimestamp =
    targetTimestamp + duration * 60 * 1000;

  const difference = Math.max(
    targetTimestamp - now,
    0
  );

  return {
    session,
    targetTimestamp,
    sessionLive:
      now >= targetTimestamp && now < endTimestamp,
    timeLeft: {
      days: Math.floor(
        difference / (1000 * 60 * 60 * 24)
      ),
      hours: Math.floor(
        (difference / (1000 * 60 * 60)) % 24
      ),
      minutes: Math.floor(
        (difference / (1000 * 60)) % 60
      ),
    },
  };
}

export default function CountdownCard() {
  const [race, setRace] = useState<RaceData | null>(
  null
);

const [sessionSnapshot, setSessionSnapshot] =
  useState<SessionSnapshot>(initialSessionSnapshot);

const nextSession = sessionSnapshot.session;
const sessionLive = sessionSnapshot.sessionLive;
const timeLeft = sessionSnapshot.timeLeft;

const info = race
  ? circuitInfo[race.circuitName]
  : undefined;

useEffect(() => {
  let cancelled = false;

  async function loadRace() {
    try {
      const nextRace = await fetchNextRace();

      if (!cancelled) {
        setRace(nextRace);
      }
    } catch (error) {
      console.error(error);
    }
  }

  loadRace();

  return () => {
    cancelled = true;
  };
}, []);

useEffect(() => {
  if (!race) return;

  const currentRace = race;

  function updateSession() {
    const now = Date.now();

    setSessionSnapshot(
      createSessionSnapshot(currentRace, now)
    );
  }

  updateSession();

  const interval = window.setInterval(
    updateSession,
    60_000
  );

  return () => window.clearInterval(interval);
}, [race]);

  const activeDate = nextSession?.date ?? race?.date ?? "";
const activeTime = nextSession?.time ?? race?.time ?? "";

const formattedDate = activeDate
  ? new Intl.DateTimeFormat("nl-NL", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(`${activeDate}T00:00:00`))
  : "";

const formattedTime = activeDate && activeTime
  ? new Intl.DateTimeFormat("nl-NL", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(`${activeDate}T${activeTime}`))
  : "";

return (
  <section className="countdown-card">
    <span
      className={`live-indicator ${
        sessionLive ? "live-active" : "live-waiting"
      }`}
    >
      <span className="live-dot" />
      LIVE • {nextSession?.name.toUpperCase() ?? "GRAND PRIX"}
    </span>

    <h2>{race?.raceName ?? "Grand Prix laden..."}</h2>

    <div className="countdown-time">
      {timeLeft.days}<span>d</span>
      {timeLeft.hours}<span>u</span>
      {timeLeft.minutes}<span>m</span>
    </div>

    {race && circuitImages[race.circuitName] && (
      <img
        src={circuitImages[race.circuitName]}
        alt={race.circuitName}
        className="circuit-outline"
      />
    )}

        <div className="countdown-date">
      {race ? (
        <div className="countdown-info">
          <ReactCountryFlag
            countryCode={countryCodes[race.country]}
            svg
            title={race.country}
            className="race-flag"
          />

          <span>
            {race.circuitName} • {formattedDate} • {formattedTime} uur
          </span>
        </div>
      ) : (
        "Racegegevens laden..."
      )}
    </div>

    {info && (
      <div className="circuit-stats">
        <div className="stat">
          <span>Length</span>
          <strong>{info.lengthKm} km</strong>
        </div>

        <div className="stat">
          <span>Laps</span>
          <strong>{info.laps}</strong>
        </div>

        <div className="stat">
          <span>DRS Zones</span>
          <strong>{info.drsZones}</strong>
        </div>
      </div>
    )}
  </section>
);
}