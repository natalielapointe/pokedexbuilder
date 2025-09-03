"use client";

import { useState, useEffect, ReactNode } from "react";
import TCGdex, { Card } from "@tcgdex/sdk";
const tcgdex = new TCGdex("en");
import {
  renderTypes,
  returnAttackEnergies,
  formatCardNameWithSymbol,
  formatIllustrator,
  renderRetreatCost,
  formatStage,
  preloadImages,
  collectCardImageUrls,
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

  const [cardIds, setCardIds] = useState<string[]>([]);
  const [noCardsFound, setNoCardsFound] = useState<null | boolean>(null);
  const [searchId, setSearchId] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchValidCard = async () => {
      try {
        let ids: string[] = [];

        const cached = localStorage.getItem("tcgdexCardIds");
        if (cached) {
          ids = JSON.parse(cached);
        } else {
          const cardRefs = await tcgdex.card.list();
          ids = cardRefs.map((card) => card.id);
          localStorage.setItem("tcgdexCardIds", JSON.stringify(ids));
        }

        setCardIds(ids);

        const fullCard = await getValidRandomCardFromIds(ids);

        const urls = collectCardImageUrls(fullCard);
        await preloadImages(urls);

        loadCardData(fullCard);
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to fetch cards", err);
        setNoCardsFound(true);
        setIsLoading(false);
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

  const getValidRandomCardFromIds = async (ids: string[]): Promise<Card> => {
    while (true) {
      const id = ids[Math.floor(Math.random() * ids.length)];
      const fullCard = await tcgdex.card.get(id);

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
        alt="Pokemon Card Generator"
        className={classes.logo}
      />
      <div className={classes.contentContainer}>
        {isLoading ? (
          <div className="flex flex-col items-center mt-[20vh]">
            <img
              className="pokeball-spin"
              src="/pokeball.png"
              alt=""
              aria-hidden="true"
              width={40}
              height={40}
            />
            <h1
              className={classes.loadingText}
              role="status"
              aria-live="polite"
            >
              Loading
              <span className="inline-flex gap-0.5 pl-[5px]" aria-hidden="true">
                <span className="inline-block animate-bounce [animation-delay:-0.48s]">
                  .
                </span>
                <span className="inline-block animate-bounce [animation-delay:-0.32s]">
                  .
                </span>
                <span className="inline-block animate-bounce [animation-delay:-0.16s]">
                  .
                </span>
              </span>
            </h1>
          </div>
        ) : noCardsFound ? (
          <p>No cards found. Please try again later.</p>
        ) : randomCard ? (
          <div className={classes.contentContainer}>
            <div className={classes.cardResultContainer}>
              <div className={classes.pokemonCardImageContainer}>
                <img
                  className={classes.pokemonCardImage}
                  src={randomCard.image ?? "/placeholder.png"}
                  alt={randomCard.name}
                  onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                />
                <button
                  className={classes.cardGeneratorButton}
                  onClick={async () => {
                    if (!cardIds.length) return;
                    const validCard = await getValidRandomCardFromIds(cardIds);
                    loadCardData(validCard);
                  }}
                >
                  Random
                  <img
                    src="/diceIcon-1x.webp"
                    srcSet="/diceIcon-1x.webp 1x, /diceIcon-2x.webp 2x, /diceIcon-3x.webp 3x"
                    alt=""
                    className={classes.diceIcon}
                  />
                </button>
              </div>

              <div className={classes.cardDetailsContainer}>
                <section className={classes.cardEvolutionInfo}>
                  <div
                    className={classes.cardStage}
                  >{`${randomCard.stage} Pokemon`}</div>
                  {randomCard.evolveFrom && (
                    <div className={classes.evolvesFrom}>
                      {`Evolves from ${randomCard.evolveFrom}`}
                    </div>
                  )}
                </section>

                <div className={classes.cardDetails}>
                  <section className={classes.cardHeader}>
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
                  </section>

                  <section className={classes.cardMoves}>
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
                          <h3 className={classes.attackName}>{attack.name}</h3>
                          <p className={classes.attackCost}>
                            {returnAttackEnergies(attack)}
                          </p>
                          <p className={classes.attackDamage}>
                            {attack.damage ?? ""}
                          </p>
                        </div>
                        <p className={classes.attackEffect}>
                          {attack.effect || ""}
                        </p>
                      </div>
                    ))}
                  </section>

                  <section className={classes.cardAttributesContainer}>
                    <div className={classes.cardAttribute}>
                      <h3 className={classes.attributeHeader}>Weakness</h3>
                      <p>{grabArrayValues(randomCard.weaknesses)}</p>
                    </div>

                    <div className={classes.cardAttribute}>
                      <h3 className={classes.attributeHeader}>Resistance</h3>
                      <p>{grabArrayValues(randomCard.resistances)}</p>
                    </div>

                    <div className={classes.cardAttribute}>
                      <h3 className={classes.attributeHeader}>Retreat Cost</h3>
                      <div>{renderRetreatCost(randomCard.retreatCost)}</div>
                    </div>
                  </section>

                  <section className={classes.cardFooter}>
                    <div className={classes.cardSet}>
                      <div className={classes.cardSetNameContainer}>
                        <p className={classes.cardSetName}>Card set</p>
                      </div>
                      <div>
                        {randomCard.cardNumber && (
                          <p className="flex">
                            {randomCard.set.name}
                            {randomCard.set.symbol && (
                              <img
                                src={`${randomCard.set.symbol}.webp`}
                                alt=""
                                className={classes.setSymbol}
                              />
                            )}
                            {randomCard.cardNumber}
                            {randomCard.set.cardCount &&
                              (randomCard.set.cardCount > 0
                                ? `/${randomCard.set.cardCount}`
                                : null)}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className={classes.cardIllustrator}>
                      <span className="font-bold">Illustrator</span>
                      <span>
                        {randomCard.illustrator &&
                          formatIllustrator(randomCard.illustrator)}
                      </span>
                    </div>
                  </section>
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
        ) : null}
      </div>
    </div>
  );
}
