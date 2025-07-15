"use client"

import { useState, useEffect, ReactNode } from "react";
import TCGdex, { Card } from "@tcgdex/sdk";
import type { CardResume } from '@tcgdex/sdk';
const tcgdex = new TCGdex('en');

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
  cardCount: number | never[];
};

export default function Home() {
  const [randomCard, setRandomCard] = useState<null | {
    name: string;
    image: string;
    rarity: string;
    type: string;
    stage: string;
    evolveFrom?: string;
    hp: number;
    weaknesses: CardModifier[];
    resistances: CardModifier[];
    retreatCost: number;
    attacks: Attack[];
    set: CardSet;
    cardNumber?: string;
    illustrator?: string;
  }>(null);

  const [cardList, setCardList] = useState<CardResume[]>([]);
  const [noCardsFound, setNoCardsFound] = useState<null | boolean>(null);

  useEffect(() => {
  const fetchValidCard = async () => {
    try {
      const cardRefs = await tcgdex.card.list();;

      let validCard: Card | null = null;

      while (!validCard) {
        const random = cardRefs[Math.floor(Math.random() * cardRefs.length)];
        const fullCard = await tcgdex.card.get(random.id);

        if (fullCard?.image && fullCard?.types?.length) {
          validCard = fullCard;
        }
      }

      setCardList(cardRefs);
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
      type: fullCard?.types?.[0] || "",
      stage: formatStage(fullCard?.stage),
      evolveFrom: fullCard?.evolveFrom,
      hp: fullCard?.hp || 0,
      weaknesses: fullCard?.weaknesses || [],
      resistances: fullCard?.resistances || [],
      retreatCost: fullCard?.retreat || 0,
      attacks: fullCard?.attacks || [],
      set: {
        name: fullCard?.set?.name || "Unknown",
        symbol: fullCard?.set?.symbol || "",
        cardCount: fullCard?.set?.cardCount.official || [],
      },
      cardNumber: fullCard?.localId || undefined,
      illustrator: fullCard?.illustrator || "Unknown",
    });
  };

  function formatStage(stage?: string): string {
    if (!stage) return "Unknown";
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
      <div className="flex flex-row items-center justify-center">
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

  return (
    <div>
      <img 
        src="/logo-1x.webp" 
        srcSet="/logo-1x.webp 1x, /logo-2x.webp 2x, /logo-3x.webp 3x" 
        alt="Your logo" 
        className="Logo"
      />
      <div className="MainContainer p-[20px] lg:pt-[60px]">  
        {noCardsFound ? ( 
          <p>No cards found. Please try again later.</p>
        ) : randomCard ? (
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
                  const randomIndex = Math.floor(Math.random() * cardList.length);
                  const newCard = await new TCGdex("en").card.get(cardList[randomIndex].id);
                  if (newCard) {
                    loadCardData(newCard);
                  }
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
                  <div className="CardStage">
                    {randomCard.stage}
                  </div>
                  {randomCard.evolveFrom && (
                    <div className="EvolvesFrom">
                        {`Evolves from ${randomCard.evolveFrom}`}
                    </div>
                  )}
                </div>
                <div className="CardDetails">
                  <div className="CardHeader sectionPadding">
                    <span className="PokemonName">{randomCard.name}</span>
                    <div className="HpAndType">
                      <div className="HPContainer">
                        <span className="HP">HP</span>
                        <span className="HpValue">{randomCard.hp}</span>
                      </div>
                      {randomCard.type &&
                        <img
                          src={`/energyIcons/${randomCard.type.toLowerCase()}.svg`}
                          alt={randomCard.type}
                          className="EnergySymbol"
                        />
                      }
                    </div>
                  </div>
                  <div className="CardMoves sectionPadding">
                    {randomCard.attacks?.map((attack, index) => (
                      <div key={index} className="AttackContainer">
                        <div
                          className="AttackRow flex items-center justify-between gap-2 py-1 text-sm"
                        >
                          <div className="AttackCost flex gap-1">
                            {attack.cost?.map((type, i) => (
                              <img
                                key={i}
                                src={`/energyIcons/${randomCard.type.toLowerCase()}.svg`}
                                alt={randomCard.type}
                                className="EnergySymbol"
                              />
                            ))}
                          </div>
                          <div className="AttackName flex-1 text-center">{attack.name}</div>
                          <div className="AttackDamage text-right min-w-[40px]">
                            {attack.damage ?? ""}
                          </div>
                        </div>
                        <div className="AttackEffect text-xs italic text-gray-500">
                          {attack.effect || ""}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="CardAttributesContainer sectionPadding">
                    <div className="CardAttribute">
                      <span className="AttributeHeader">Weakness</span>
                      <span>
                        {grabArrayValues(randomCard.weaknesses)}
                      </span>
                    </div>
                    <div className="CardAttribute">
                      <span className="AttributeHeader">Resistance</span>
                      <span>
                        {grabArrayValues(randomCard.resistances)}
                      </span>
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
                              style={{ height: "20px", width: "auto", marginLeft: "5px" }}
                            />
                          )}
                      </div>
                      <div className="CardNumber">
                        {randomCard.cardNumber && `${randomCard.cardNumber}/${randomCard.set.cardCount}`}
                      </div>
                    </div>
                    <div className="WhiteLine"/>
                    <div className="CardIllustrator">
                      <span className="font-bold">Illustrator</span>
                      <span>{randomCard.illustrator}</span>
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
