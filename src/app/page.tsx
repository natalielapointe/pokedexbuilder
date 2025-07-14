"use client"

import { useState, useEffect } from "react";
import TCGdex, { Card } from "@tcgdex/sdk";

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
}

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

  const [noCardsFound, setNoCardsFound] = useState<null | boolean>(null);

  useEffect(() => {
    const tcgdex = new TCGdex("en");

    const getRandomCard = async () => {
      const fullCard = await tcgdex.card.get("bw9-97");
      console.log(fullCard);

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

    getRandomCard();
  }, []);

  function formatStage(stage?: string): string {
    if (!stage) return "Unknown";

    if (stage.startsWith("Stage")) {
      return stage.replace("Stage", "Stage ");
    }

    return stage;
  }

  function grabArrayValues(arr?: CardModifier[] | null): string {
    if (!arr || arr.length === 0) return "None";
    return arr.map((w) => `${w.type} ${w.value ?? ""}`).join(", ");
  }

  return (
    <div>
      <img 
        src="/logo-1x.webp" 
        srcSet="/logo-1x.webp 1x, /logo-2x.webp 2x, /logo-3x.webp 3x" 
        alt="Your logo" 
        className="Logo"
      />
      <div className="MainContainer">  
        {noCardsFound ? ( 
          <p>No cards found. Please try again later.</p>
        ) :
          randomCard ? (
            <div className="flex flex-col items-center justify-center">
              <img 
                className="PokemonCardImage"
                src={randomCard.image ?? "/placeholder.png"} 
                onError={(e) => (e.currentTarget.src = "/placeholder.png")}
              />
              <button className="RandomCardGeneratorButton hover:bg-blue-600 transition-colors duration-300">
                Random
                <img 
                  src="/diceIcon-1x.webp" 
                  srcSet="/diceIcon-1x.webp 1x, /diceIcon-2x.webp 2x, /diceIcon-3x.webp 3x" 
                  alt="Your diceIcon" 
                  className="diceIcon"
                />
              </button>
              <div className="CardDetailsContainer">
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
                  <div className="CardHeader">
                    <span>{randomCard.name}</span>
                    <div className="HpAndType">
                      <div className="HPContainer">
                        <span className="HP">HP</span>
                        <span>{randomCard.hp}</span>
                      </div>
                      {randomCard.type &&
                        <img
                          src={`/energyIcons/${randomCard.type.toLowerCase()}.svg`}
                          alt={randomCard.type}
                          className="h-5 w-5"
                        />
                      }
                    </div>
                  </div>
                  <div className="CardMoves">
                    {randomCard.attacks?.map((attack, index) => (
                      <div key={index} className="AttackContainer">
                        <div
                          className="AttackRow flex items-center justify-between gap-2 border-b py-1 text-sm"
                        >
                          <div className="AttackCost flex gap-1">
                            {attack.cost?.map((type, i) => (
                              <img
                                key={i}
                                src={`/energyIcons/${type.toLowerCase()}.webp`}
                                alt={type}
                                className="h-5 w-5"
                              />
                            ))}
                          </div>
                          <div className="flex-1 text-center">{attack.name}</div>
                          <div className="text-right min-w-[40px] font-semibold">
                            {attack.damage ?? ""}
                          </div>
                        </div>
                        <div className="AttackEffect text-xs italic text-gray-500">
                          {attack.effect || ""}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="CardAttributes">
                    <span>
                      Weakness: {grabArrayValues(randomCard.weaknesses)}
                    </span>
                    <span>
                      Resistance: {grabArrayValues(randomCard.resistances)}
                    </span>
                    <span>{`Retreat Cost: ${randomCard.retreatCost}`}</span>
                  </div>
                  <div className="CardSet flex items-center justify-center">
                    <span>Set: {randomCard.set.name}</span>
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
                  <div className="CardIllustrator">
                    Illustrator: {randomCard.illustrator}
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
