"use client";

import { useState, useEffect, ReactNode } from "react";
import { Skeleton } from "@mui/material";
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
  getValidRandomCardFromIds,
  grabArrayValues,
} from "./helpers";
import classes from "./classNames";

type CardModifier = { type: string; value?: string };
type Attack = {
  name: string;
  cost?: string[];
  damage?: string | number;
  effect?: string;
};
type CardSet = { name: string; symbol: string; cardCount: number };
type Abilties = { name: string; type: string; effect: string };

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
  const [isLoadingNewCard, setIsLoadingNewCard] = useState<boolean>(false);

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

  const fetchOrCacheCardIds = async (): Promise<string[]> => {
    const cached = localStorage.getItem("tcgdexCardIds");
    if (cached) return JSON.parse(cached) as string[];

    const cardRefs = await tcgdex.card.list();
    const ids = cardRefs.map((card) => card.id);
    localStorage.setItem("tcgdexCardIds", JSON.stringify(ids));
    return ids;
  };

  const prepareAndShowCard = async (
    cardFetcher: () => Promise<Card>,
    setLoading: (v: boolean) => void,
  ) => {
    setLoading(true);
    try {
      const fullCard = await cardFetcher();
      const urls = collectCardImageUrls(fullCard);
      await preloadImages(urls);
      await loadCardData(fullCard);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const run = async () => {
      try {
        const ids = await fetchOrCacheCardIds();
        setCardIds(ids);

        await prepareAndShowCard(
          () => getValidRandomCardFromIds(ids),
          setIsLoading,
        );
      } catch (err) {
        console.error("Failed to fetch cards", err);
        setNoCardsFound(true);
        setIsLoading(false);
      }
    };
    run();
  }, []);

  const handleRandom = async () => {
    if (!cardIds.length) return;
    try {
      await prepareAndShowCard(
        () => getValidRandomCardFromIds(cardIds),
        setIsLoadingNewCard,
      );
    } catch (err) {
      console.error("Random load failed", err);
    }
  };

  const handleSearch = async () => {
    if (!searchId.trim()) return;
    try {
      await prepareAndShowCard(async () => {
        const card = await tcgdex.card.get(searchId.trim());
        if (!card) throw new Error("Card not found");
        return card;
      }, setIsLoadingNewCard);
    } catch (err) {
      console.error("Failed to fetch card by ID:", err);
      alert("Card not found. Please check the ID.");
    }
  };

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
                {isLoadingNewCard ? (
                  <Skeleton variant="rounded" width={232} height={320} />
                ) : (
                  <img
                    className={classes.pokemonCardImage}
                    src={randomCard.image ?? "/placeholder.png"}
                    alt={randomCard.name}
                    onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                  />
                )}

                <button
                  className={classes.cardGeneratorButton}
                  onClick={handleRandom}
                  disabled={isLoadingNewCard}
                >
                  {isLoadingNewCard ? "Loading…" : "Random"}
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
                  {isLoadingNewCard ? (
                    <Skeleton variant="rounded" width={260} height={36} />
                  ) : (
                    <>
                      <div
                        className={classes.cardStage}
                      >{`${randomCard.stage} Pokemon`}</div>
                      {randomCard.evolveFrom && (
                        <div className={classes.evolvesFrom}>
                          {`Evolves from ${randomCard.evolveFrom}`}
                        </div>
                      )}
                    </>
                  )}
                </section>

                <div className={classes.cardDetails}>
                  <section className={classes.cardHeader}>
                    {isLoadingNewCard ? (
                      <div className="w-full">
                        <Skeleton variant="text" width={240} height={32} />
                        <Skeleton variant="text" width={160} height={24} />
                      </div>
                    ) : (
                      <>
                        <span className={classes.cardName}>
                          {formatCardNameWithSymbol(randomCard.name)}
                        </span>
                        <div className={classes.hpAndType}>
                          <div className={classes.hpContainer}>
                            <span className={classes.hp}>HP</span>
                            <span className={classes.hpValue}>
                              {randomCard.hp}
                            </span>
                          </div>
                          {randomCard.types && renderTypes(randomCard.types)}
                        </div>
                      </>
                    )}
                  </section>

                  <section className={classes.cardMoves}>
                    {isLoadingNewCard ? (
                      <>
                        <Skeleton variant="text" width={280} height={24} />
                        <Skeleton variant="text" width={320} height={24} />
                        <Skeleton variant="text" width={260} height={24} />
                      </>
                    ) : (
                      <>
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
                              <h3 className={classes.attackName}>
                                {attack.name}
                              </h3>
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
                      </>
                    )}
                  </section>

                  <section className={classes.cardAttributesContainer}>
                    {isLoadingNewCard ? (
                      <>
                        <Skeleton variant="text" width={180} height={24} />
                        <Skeleton variant="text" width={180} height={24} />
                        <Skeleton variant="text" width={180} height={24} />
                      </>
                    ) : (
                      <>
                        <div className={classes.cardAttribute}>
                          <h3 className={classes.attributeHeader}>Weakness</h3>
                          <p>{grabArrayValues(randomCard.weaknesses)}</p>
                        </div>
                        <div className={classes.cardAttribute}>
                          <h3 className={classes.attributeHeader}>
                            Resistance
                          </h3>
                          <p>{grabArrayValues(randomCard.resistances)}</p>
                        </div>
                        <div className={classes.cardAttribute}>
                          <h3 className={classes.attributeHeader}>
                            Retreat Cost
                          </h3>
                          <div>{renderRetreatCost(randomCard.retreatCost)}</div>
                        </div>
                      </>
                    )}
                  </section>

                  <section className={classes.cardFooter}>
                    {isLoadingNewCard ? (
                      <>
                        <Skeleton variant="text" width={220} height={24} />
                        <Skeleton variant="text" width={200} height={20} />
                      </>
                    ) : (
                      <>
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
                      </>
                    )}
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
                disabled={isLoadingNewCard}
              />
              <button
                onClick={handleSearch}
                className={classes.searchButton}
                disabled={isLoadingNewCard}
              >
                {isLoadingNewCard ? "Loading…" : "Search"}
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
