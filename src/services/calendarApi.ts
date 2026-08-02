export type RaceWeekend = {
  round: string;
  raceName: string;
  circuitName: string;
  country: string;
  date: string;
};

export async function fetchCalendar(): Promise<RaceWeekend[]> {
  const response = await fetch(
    "https://api.jolpi.ca/ergast/f1/current.json"
  );

  if (!response.ok) {
    throw new Error("Kalender kon niet worden opgehaald.");
  }

  const data = await response.json();

  return data.MRData.RaceTable.Races.map((race: any) => ({
    round: race.round,
    raceName: race.raceName,
    circuitName: race.Circuit.circuitName,
    country: race.Circuit.Location.country,
    date: race.date,
  }));
}
