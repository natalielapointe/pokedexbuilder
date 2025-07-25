import { ReactNode } from "react";

function renderTypes(types: string[]): React.ReactNode[] {
  return types.map((type) => (
    <img
      key={type}
      src={`/energyIcons/${type.toLowerCase()}.svg`}
      alt={type}
      className="EnergySymbol"
    />
  ));
}

function returnAttackEnergies(attack: { cost?: string[] }): React.ReactNode {
  if (attack.cost) {
    return attack.cost.map((type, i) => (
      <img
        key={i}
        src={`/energyIcons/${type?.toLowerCase?.() ?? "energyless"}.svg`}
        alt={type}
        className="EnergySymbol"
      />
    ));
  } else {
    return (
      <img
        src={"/energyIcons/energyless.svg"}
        alt="energyless"
        className="EnergySymbol"
      />
    );
  }
}

function formatCardNameWithSymbol(name: string): React.ReactNode {
  const parts = name.split(/ G\b/);

  if (parts.length === 2) {
    return (
      <>
        {parts[0]}
        <img
          src="./team-g-symbol.png"
          alt="Team G"
          style={{
            height: "20px",
            width: "auto",
            marginLeft: "5px",
          }}
        />
      </>
    );
  }
  return name;
}

function formatIllustrator(illustrator: string): string {
  const cleaned = illustrator.replace(/Illus\.＆Direc\.\s*/g, "").trim();

  return cleaned.replace(
    /\b\w+/g,
    (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
  );
}

function renderRetreatCost(retreatCost?: number): ReactNode {
  if (!retreatCost || retreatCost <= 0) {
    return <span>None</span>;
  }

  return (
    <div className="flex flex-row items-center justify-center gap-1">
      {Array.from({ length: retreatCost }).map((_, index) => (
        <img
          key={index}
          src="/energyIcons/colorless.svg"
          alt="Colorless Energy"
          className="EnergySymbol"
        />
      ))}
    </div>
  );
}

function formatStage(stage?: string): string {
  if (!stage) return "Basic";
  if (stage.startsWith("Stage")) return stage.replace("Stage", "Stage ");
  return stage;
}

export {
  renderTypes,
  returnAttackEnergies,
  formatCardNameWithSymbol,
  formatIllustrator,
  renderRetreatCost,
  formatStage,
};
