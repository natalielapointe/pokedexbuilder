import { ReactNode } from "react";
import classes from "./classNames";
import TCGdex, { Card } from "@tcgdex/sdk";
const tcgdex = new TCGdex("en");

type CardModifier = { type: string; value?: string };

const getValidRandomCardFromIds = async (ids: string[]): Promise<Card> => {
  while (true) {
    const id = ids[Math.floor(Math.random() * ids.length)];
    const fullCard = await tcgdex.card.get(id);
    if (fullCard?.image && fullCard?.category === "Pokemon") return fullCard;
  }
};

function grabArrayValues(arr?: CardModifier[] | null): ReactNode {
  if (!arr || arr.length === 0) return "None";
  return arr.map((w, index) => (
    <span key={index} className={classes.attributeIconContainer}>
      <img
        src={`/energyIcons/${w.type.toLowerCase()}.svg`}
        alt={w.type}
        className={classes.energySymbol}
      />
      {w.value ?? ""}
      {index < arr.length - 1 && ","}
    </span>
  ));
}

function renderTypes(types: string[]): React.ReactNode[] {
  return types.map((type, index) => (
    <img
      key={type}
      src={`/energyIcons/${type.toLowerCase()}.svg`}
      alt={type}
      className={`${classes.energySymbol} ${index > 0 ? "pl-[3px]" : ""}`}
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
        className={classes.energySymbol}
      />
    ));
  } else {
    return (
      <img
        src={"/energyIcons/energyless.svg"}
        alt="energyless"
        className={classes.energySymbol}
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
          className={classes.energySymbol}
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

function preloadImage(src: string | undefined): Promise<void> {
  return new Promise<void>((resolve) => {
    if (!src) return resolve();

    const img: HTMLImageElement = new Image();
    img.src = src;

    const anyImg = img as any;

    if (typeof anyImg.decode === "function") {
      anyImg
        .decode()
        .then(() => resolve())
        .catch(() => resolve());
      return;
    }

    if (img.complete) {
      resolve();
      return;
    }

    img.onload = () => resolve();
    img.onerror = () => resolve();
  });
}

async function preloadImages(srcs: (string | undefined)[]): Promise<void> {
  const unique = Array.from(new Set(srcs.filter(Boolean))) as string[];
  await Promise.all(unique.map(preloadImage));
}

function collectCardImageUrls(fullCard: Card) {
  const urls: string[] = [];

  const cardImg = fullCard?.image ? `${fullCard.image}/high.webp` : undefined;
  if (cardImg) urls.push(cardImg);

  if (fullCard?.set?.symbol) {
    urls.push(`${fullCard.set.symbol}.webp`);
  }

  const types = Array.isArray(fullCard?.types) ? fullCard.types : [];
  types.forEach((type) =>
    urls.push(`/energyIcons/${String(type).toLowerCase()}.svg`),
  );

  const wk = Array.isArray(fullCard?.weaknesses) ? fullCard.weaknesses : [];
  const rs = Array.isArray(fullCard?.resistances) ? fullCard.resistances : [];
  [...wk, ...rs].forEach(
    (energy) =>
      energy?.type &&
      urls.push(`/energyIcons/${String(energy.type).toLowerCase()}.svg`),
  );

  const atks = Array.isArray(fullCard?.attacks) ? fullCard.attacks : [];
  atks.forEach((attack) =>
    (attack?.cost ?? []).forEach((cost) =>
      urls.push(`/energyIcons/${String(cost).toLowerCase()}.svg`),
    ),
  );

  if (fullCard?.retreat && fullCard.retreat > 0) {
    for (let i = 0; i < fullCard.retreat; i++) {
      urls.push(`/energyIcons/colorless.svg`);
    }
  }

  urls.push(
    "/diceIcon-1x.webp",
    "/diceIcon-2x.webp",
    "/diceIcon-3x.webp",
    "./placeholder.png",
  );

  return urls;
}

export {
  renderTypes,
  returnAttackEnergies,
  formatCardNameWithSymbol,
  formatIllustrator,
  renderRetreatCost,
  formatStage,
  preloadImages,
  collectCardImageUrls,
  getValidRandomCardFromIds,
  grabArrayValues,
};
