"use client";

import { useState, useEffect, ReactNode } from "react";
import TCGdex, { Card } from "@tcgdex/sdk";
import type { CardResume } from "@tcgdex/sdk";
const tcgdex = new TCGdex("en");
import {
  renderTypes,
  returnAttackEnergies,
  formatCardNameWithSymbol,
  formatIllustrator,
  renderRetreatCost,
  formatStage,
} from "./helpers";
import classes from "./classNames";

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

  return (
    <div>
      <img
        src="/logo-1x.webp"
        srcSet="/logo-1x.webp 1x, /logo-2x.webp 2x, /logo-3x.webp 3x"
        alt="Your logo"
        className={classes.logo}
      />
      <div className={classes.contentContainer}>
        {noCardsFound ? (
          <p>No cards found. Please try again later.</p>
        ) : randomCard ? (
          <div className={classes.contentContainer}>
            <div className={classes.cardResultContainer}>
              <div className={classes.pokemonCardImageContainer}>
                <img
                  className={classes.pokemonCardImage}
                  src={randomCard.image ?? "/placeholder.png"}
                  onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                />
                <button
                  className={classes.cardGeneratorButton}
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
                    className={classes.diceIcon}
                  />
                </button>
              </div>
              <div className={classes.cardDetailsContainer}>
                <div className={classes.cardEvolutionInfo}>
                  <div className={classes.cardStage}>{randomCard.stage}</div>
                  {randomCard.evolveFrom && (
                    <div className={classes.evolvesFrom}>
                      {`Evolves from ${randomCard.evolveFrom}`}
                    </div>
                  )}
                </div>
                <div className={classes.cardDetails}>
                  <div className={classes.cardHeader}>
                    <span className={classes.cardName}>
                      {formatCardNameWithSymbol(randomCard.name)}
                    </span>
                    <div className={classes.hpAndType}>
                      <div className={classes.hpContainer}>
                        <span className={classes.hp}>HP</span>
                        <span className={classes.hpValue}>{randomCard.hp}</span>
                      </div>
                      {randomCard.types && renderTypes(randomCard.types)}
                    </div>
                  </div>
                  <div className={classes.cardMoves}>
                    {randomCard.abilties?.map((ability, index) => (
                      <div key={index} className={classes.abilityContainer}>
                        <div className={classes.abilityRow}>
                          <div className={classes.abilityHeader}>
                            <span className={classes.abilityType}>
                              {ability.type}
                            </span>
                            <span className={classes.abilityName}>
                              {ability.name}
                            </span>
                          </div>
                          <div className={classes.attackEffect}>
                            {ability.effect}
                          </div>
                        </div>
                      </div>
                    ))}
                    {randomCard.attacks?.map((attack, index) => (
                      <div key={index} className={classes.attackContainer}>
                        <div className={classes.attackRow}>
                          <div className={classes.attackCost}>
                            {returnAttackEnergies(attack)}
                          </div>
                          <div className={classes.attackName}>
                            {attack.name}
                          </div>
                          <div className={classes.attackDamage}>
                            {attack.damage ?? ""}
                          </div>
                        </div>
                        <div className={classes.attackEffect}>
                          {attack.effect || ""}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className={classes.cardAttributesContainer}>
                    <div className={classes.cardAttribute}>
                      <span className={classes.attributeHeader}>Weakness</span>
                      <span>{grabArrayValues(randomCard.weaknesses)}</span>
                    </div>
                    <div className={classes.cardAttribute}>
                      <span className={classes.attributeHeader}>
                        Resistance
                      </span>
                      <span>{grabArrayValues(randomCard.resistances)}</span>
                    </div>
                    <div className={classes.cardAttribute}>
                      <span className={classes.attributeHeader}>
                        Retreat Cost
                      </span>
                      <span>{renderRetreatCost(randomCard.retreatCost)}</span>
                    </div>
                  </div>
                  <div className={classes.cardFooter}>
                    <div className={classes.cardSet}>
                      <div className={classes.cardSetNameContainer}>
                        <span className={classes.cardSetName}>
                          {randomCard.set.name}
                        </span>
                        {randomCard.set.symbol && (
                          <img
                            src={`${randomCard.set.symbol}.webp`}
                            alt={randomCard.set.name}
                            className={classes.setSymbol}
                          />
                        )}
                      </div>
                      <div>
                        {randomCard.cardNumber && randomCard.cardNumber}
                        {randomCard.set.cardCount &&
                        randomCard.set.cardCount > 0
                          ? `/${randomCard.set.cardCount}`
                          : null}
                      </div>
                    </div>
                    <div className={classes.cardIllustrator}>
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
            <div className={classes.cardSearch}>
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Enter Pokémon card ID"
                className={classes.input}
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
                className={classes.searchButton}
              >
                Search
              </button>
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}
