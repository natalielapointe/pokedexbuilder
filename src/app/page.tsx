"use client";

import { useState, useEffect, ReactNode } from "react";
import TCGdex, { Card } from "@tcgdex/sdk";
import type { CardResume } from "@tcgdex/sdk";
const tcgdex = new TCGdex("en");

type CardModifier = {
  type: string;
  value?: string;
};

type Attack = {
  name: string;
  cost?: string[];
  damage?: string | number;
  effect?: string;
};

type CardSet = {
  name: string;
  symbol: string;
  cardCount: number;
};

type Abilties = {
  name: string;
  type: string;
  effect: string;
};

export default function Home() {
  const [randomCard, setRandomCard] = useState<null | {
    name: string;
    image: string;
    rarity: string;
    types: string[];
    stage: string;
    evolveFrom?: string;
    hp: number;
    weaknesses: CardModifier[];
    resistances: CardModifier[];
    retreatCost: number;
    attacks: Attack[];
    abilties: Abilties[];
    set: CardSet;
    cardNumber?: string;
    illustrator?: string;
    category: string;
  }>(null);

  const [cardList, setCardList] = useState<CardResume[]>([]);
  const [noCardsFound, setNoCardsFound] = useState<null | boolean>(null);
  const [searchId, setSearchId] = useState("");

  useEffect(() => {
    const fetchValidCard = async () => {
      try {
        const cardRefs = await tcgdex.card.list();

        const validCard = await getValidRandomCard(cardRefs);

        setCardList(cardRefs);
        console.log(validCard);
        loadCardData(validCard);
      } catch (err) {
        console.error("Failed to fetch cards", err);
        setNoCardsFound(true);
      }
    };

    fetchValidCard();
  }, []);

  const loadCardData = async (fullCard: Card) => {
    setRandomCard({
      name: fullCard?.name || "Unknown",
      image: `${fullCard?.image}/high.webp` || "placeholder.png",
      rarity: fullCard?.rarity || "Unknown",
      types: Array.isArray(fullCard.types) ? fullCard.types : [],
      stage: formatStage(fullCard?.stage),
      evolveFrom: fullCard?.evolveFrom,
      hp: fullCard?.hp || 0,
      weaknesses: fullCard?.weaknesses || [],
      resistances: fullCard?.resistances || [],
      retreatCost: fullCard?.retreat || 0,
      attacks: fullCard?.attacks || [],
      abilties: fullCard?.abilities || [],
      set: {
        name: fullCard?.set?.name || "Unknown",
        symbol: fullCard?.set?.symbol || "",
        cardCount: fullCard?.set?.cardCount.official || 0,
      },
      cardNumber: fullCard?.localId || undefined,
      illustrator: fullCard?.illustrator || "Unknown",
      category: fullCard?.category,
    });
  };

  const getValidRandomCard = async (cardRefs: CardResume[]): Promise<Card> => {
    while (true) {
      const random = cardRefs[Math.floor(Math.random() * cardRefs.length)];
      const fullCard = await tcgdex.card.get(random.id);

      if (fullCard?.image && fullCard?.category === "Pokemon") {
        return fullCard;
      }
    }
  };

  function formatStage(stage?: string): string {
    if (!stage) return "Basic";
    if (stage.startsWith("Stage")) return stage.replace("Stage", "Stage ");
    return stage;
  }

  function grabArrayValues(arr?: CardModifier[] | null): ReactNode {
    if (!arr || arr.length === 0) return "None";

    return arr.map((w, index) => (
      <span key={index} className="inline-flex items-center gap-1">
        <img
          src={`/energyIcons/${w.type.toLowerCase()}.svg`}
          alt={w.type}
          className="EnergySymbol"
        />
        {w.value ?? ""}
        {index < arr.length - 1 && ","}
      </span>
    ));
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

  function formatIllustrator(illustrator: string): string {
    const cleaned = illustrator.replace(/Illus\.＆Direc\.\s*/g, "").trim();

    return cleaned.replace(
      /\b\w+/g,
      (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
    );
  }

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

  return (
    <div>
      <img
        src="/logo-1x.webp"
        srcSet="/logo-1x.webp 1x, /logo-2x.webp 2x, /logo-3x.webp 3x"
        alt="Your logo"
        className="Logo"
      />
      <div className="MainContainer m-[10px] lg:m-[50px]">
        {noCardsFound ? (
          <p>No cards found. Please try again later.</p>
        ) : randomCard ? (
          <div className="flex flex-col items-center justify-center">
            <div className="CardSearch flex items-center gap-2 mb-4">
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Enter Pokémon card ID"
                className="border border-gray-300 rounded px-2 py-1 text-sm w-60"
              />
              <button
                onClick={async () => {
                  if (!searchId.trim()) return;

                  try {
                    const foundCard = await tcgdex.card.get(searchId.trim());
                    if (foundCard) {
                      console.log(foundCard);
                      loadCardData(foundCard);
                    }
                  } catch (err) {
                    console.error("Failed to fetch card by ID:", err);
                    alert("Card not found. Please check the ID.");
                  }
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
              >
                Search
              </button>
            </div>
            <div className="flex flex-col lg:flex-row items-center justify-center">
              <div className="flex flex-col items-center justify-center">
                <img
                  className="PokemonCardImage"
                  src={randomCard.image ?? "/placeholder.png"}
                  onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                />
                <button
                  className="RandomCardGeneratorButton hover:bg-blue-600 transition-colors duration-300"
                  onClick={async () => {
                    if (!cardList.length) return;
                    const validCard = await getValidRandomCard(cardList);
                    loadCardData(validCard);
                  }}
                >
                  Random
                  <img
                    src="/diceIcon-1x.webp"
                    srcSet="/diceIcon-1x.webp 1x, /diceIcon-2x.webp 2x, /diceIcon-3x.webp 3x"
                    alt="Your diceIcon"
                    className="diceIcon"
                  />
                </button>
              </div>
              <div className="CardDetailsContainer lg:pl-[20px]">
                <div className="CardEvolutionInfo">
                  <div className="CardStage">{randomCard.stage}</div>
                  {randomCard.evolveFrom && (
                    <div className="EvolvesFrom">
                      {`Evolves from ${randomCard.evolveFrom}`}
                    </div>
                  )}
                </div>
                <div className="CardDetails">
                  <div className="CardHeader sectionPadding">
                    <span className="PokemonName">
                      {formatCardNameWithSymbol(randomCard.name)}
                    </span>
                    <div className="HpAndType">
                      <div className="HPContainer">
                        <span className="HP">HP</span>
                        <span className="HpValue">{randomCard.hp}</span>
                      </div>
                      {randomCard.types && renderTypes(randomCard.types)}
                    </div>
                  </div>
                  <div className="CardMoves sectionPadding">
                    {randomCard.abilties?.map((ability, index) => (
                      <div key={index} className="AbilityContainer pb-[10px]">
                        <div className="AbilityRow text-left">
                          <div className="AbilityHeader flex-row">
                            <span className="AbilityType">{ability.type}</span>
                            <span className="AbilityName">{ability.name}</span>
                          </div>
                          <div className="AttackEffect">{ability.effect}</div>
                        </div>
                      </div>
                    ))}
                    {randomCard.attacks?.map((attack, index) => (
                      <div key={index} className="AttackContainer pb-[10px]">
                        <div className="AttackRow flex items-center justify-between gap-2 py-1 text-sm">
                          <div className="AttackCost flex gap-1">
                            {attack.cost?.map((type, i) => (
                              <img
                                key={i}
                                src={`/energyIcons/${type.toLowerCase()}.svg`}
                                alt={type}
                                className="EnergySymbol"
                              />
                            ))}
                          </div>
                          <div className="AttackName flex-1 text-center">
                            {attack.name}
                          </div>
                          <div className="AttackDamage text-right min-w-[40px]">
                            {attack.damage ?? ""}
                          </div>
                        </div>
                        <div className="AttackEffect">
                          {attack.effect || ""}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="CardAttributesContainer sectionPadding">
                    <div className="CardAttribute">
                      <span className="AttributeHeader">Weakness</span>
                      <span>{grabArrayValues(randomCard.weaknesses)}</span>
                    </div>
                    <div className="CardAttribute">
                      <span className="AttributeHeader">Resistance</span>
                      <span>{grabArrayValues(randomCard.resistances)}</span>
                    </div>
                    <div className="CardAttribute">
                      <span className="AttributeHeader">Retreat Cost</span>
                      <span>{renderRetreatCost(randomCard.retreatCost)}</span>
                    </div>
                  </div>
                  <div className="CardFooter sectionPadding flex flex-row justify-between items-stretch">
                    <div className="CardSet">
                      <div className="flex items-center justify-center">
                        <span className="font-bold">{randomCard.set.name}</span>
                        {randomCard.set.symbol && (
                          <img
                            src={`${randomCard.set.symbol}.webp`}
                            alt={randomCard.set.name}
                            className="SetSymbol"
                            style={{
                              height: "20px",
                              width: "auto",
                              marginLeft: "5px",
                            }}
                          />
                        )}
                      </div>
                      <div className="CardNumber">
                        {randomCard.cardNumber && randomCard.cardNumber}
                        {randomCard.set.cardCount &&
                        randomCard.set.cardCount > 0
                          ? `/${randomCard.set.cardCount}`
                          : null}
                      </div>
                    </div>
                    <div className="CardIllustrator">
                      <span className="font-bold">Illustrator</span>
                      <span>
                        {randomCard.illustrator &&
                          formatIllustrator(randomCard.illustrator)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}
