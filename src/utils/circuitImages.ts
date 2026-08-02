const circuitFiles = import.meta.glob<string>(
  "../assets/circuits/*.svg",
  {
    eager: true,
    import: "default",
  }
);

function findCircuitImage(fileName: string): string | undefined {
  const entry = Object.entries(circuitFiles).find(([path]) =>
    path.endsWith(`/${fileName}`)
  );

  return entry?.[1];
}

export const circuitImages: Record<string, string | undefined> = {
  "Albert Park Grand Prix Circuit": findCircuitImage("melbourne-2.svg"),
  "Shanghai International Circuit": findCircuitImage("shanghai-1.svg"),
  "Suzuka Circuit": findCircuitImage("suzuka-2.svg"),
  "Miami International Autodrome": findCircuitImage("miami-1.svg"),
  "Circuit Gilles Villeneuve": findCircuitImage("montreal-6.svg"),
  "Circuit de Monaco": findCircuitImage("monaco-6.svg"),
  "Circuit de Barcelona-Catalunya": findCircuitImage("catalunya-6.svg"),
  "Red Bull Ring": findCircuitImage("spielberg-3.svg"),
  "Silverstone Circuit": findCircuitImage("silverstone-8.svg"),
  "Circuit de Spa-Francorchamps": findCircuitImage("spa-francorchamps-4.svg"),
  "Hungaroring": findCircuitImage("hungaroring-3.svg"),
  "Circuit Park Zandvoort": findCircuitImage("zandvoort.svg"),
  "Autodromo Nazionale di Monza": findCircuitImage("monza-7.svg"),
  "Madring": findCircuitImage("madring-1.svg"),
  "Baku City Circuit": findCircuitImage("baku-1.svg"),
  "Sepang International Circuit": findCircuitImage("sepang-1.svg"),
  "Marina Bay Street Circuit": findCircuitImage("marina-bay-4.svg"),
  "Circuit of the Americas": findCircuitImage("austin-1.svg"),
  "Autódromo Hermanos Rodríguez": findCircuitImage("mexico-city-3.svg"),
  "Autódromo José Carlos Pace": findCircuitImage("interlagos-2.svg"),
  "Las Vegas Strip Street Circuit": findCircuitImage("las-vegas-1.svg"),
  "Losail International Circuit": findCircuitImage("lusail-1.svg"),
  "Yas Marina Circuit": findCircuitImage("yas-marina-2.svg"),
  "Bahrain International Circuit": findCircuitImage("bahrain-1.svg"),
  "Jeddah Corniche Circuit": findCircuitImage("jeddah-1.svg"),
};