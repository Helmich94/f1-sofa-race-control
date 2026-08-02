export type SessionTime = {
  date: string;
  time: string;
};

export type NextRace = {
  raceName: string;
  circuitName: string;
  locality: string;
  country: string;
  date: string;
  time: string;

  firstPractice?: SessionTime;
  secondPractice?: SessionTime;
  thirdPractice?: SessionTime;
  qualifying?: SessionTime;
  sprint?: SessionTime;
  sprintQualifying?: SessionTime;
};

export async function fetchNextRace(): Promise<NextRace> {
  const response = await fetch(
    "https://api.jolpi.ca/ergast/f1/current/next.json"
  );

  if (!response.ok) {
    throw new Error("De volgende Grand Prix kon niet worden opgehaald.");
  }

  const data = await response.json();
  const race = data.MRData.RaceTable.Races[0];

  if (!race) {
    throw new Error("Er is geen volgende Grand Prix gevonden.");
  }

function mapSession(
  session?: { date?: string; time?: string }
): SessionTime | undefined {
  if (!session?.date || !session?.time) {
    return undefined;
  }

  return {
    date: session.date,
    time: session.time,
  };
}

return {
  raceName: race.raceName,
  circuitName: race.Circuit.circuitName,
  locality: race.Circuit.Location.locality,
  country: race.Circuit.Location.country,
  date: race.date,
  time: race.time,

  firstPractice: mapSession(race.FirstPractice),
  secondPractice: mapSession(race.SecondPractice),
  thirdPractice: mapSession(race.ThirdPractice),
  qualifying: mapSession(race.Qualifying),
  sprint: mapSession(race.Sprint),
  sprintQualifying: mapSession(race.SprintQualifying),
};
}
