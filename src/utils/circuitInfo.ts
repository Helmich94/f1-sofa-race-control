export type CircuitInfo = {
  lengthKm: number;
  laps: number;
  drsZones: number;
};

export const circuitInfo: Record<string, CircuitInfo> = {
  "Circuit Park Zandvoort": {
    lengthKm: 4.259,
    laps: 72,
    drsZones: 2,
  },
};
