'use client'

import { useState, useEffect } from 'react';
import TCGdex from '@tcgdex/sdk';

export default function Home() {

const [randomCard, setRandomCard] = useState<null | {
  name: string;
  image: string;
  set: string;
  rarity: string;
}>(null);

const [noCardsFound, setNoCardsFound] = useState<null | boolean>(null);

useEffect(() => {
  const tcgdex = new TCGdex('en');

  const getRandomCard = async () => {
    // const allCards = await tcgdex.card.list();
    // if (!allCards || allCards.length === 0) {
    //   setNoCardsFound(true);
    //   setRandomCard(null);
    //   return;
    // }
    // const cardsWithImages = allCards.filter(card => !!card.image);
    // const randomPreview = cardsWithImages[Math.floor(Math.random() * cardsWithImages.length)];
    const fullCard = await tcgdex.card.get("bw9-97");
    console.log(fullCard);

    setRandomCard({
      name: fullCard?.name || 'Unknown',
      image: `${fullCard?.image}/high.webp` || 'placeholder.png',
      set: fullCard?.set.name || 'Unknown',
      rarity: fullCard?.rarity || 'Unknown',
    });
  };

  getRandomCard();
}, []);


  return (
    <div>
      <img 
        src="/logo-1x.webp" 
        srcSet="/logo-1x.webp 1x, /logo-2x.webp 2x, /logo-3x.webp 3x" 
        alt="Your logo" 
        className='logo'
      />
      <div className='flex flex-col items-center justify-center text-center pt-[50]'>  
        {noCardsFound ? ( 
          <p>No cards found. Please try again later.</p>
        ) :
          randomCard ? (
            <div className='flex flex-col items-center justify-center'>
              <img 
                className='pokemonCardImage'
                src={randomCard.image} 
                alt={randomCard.name} 
                onError={(e) => (e.currentTarget.src = '/placeholder.png')}
              />
              <button className='randomCardGeneratorButton hover:bg-blue-600 transition-colors duration-300'>
                Random
                <img 
                  src="/diceIcon-1x.webp" 
                  srcSet="/diceIcon-1x.webp 1x, /diceIcon-2x.webp 2x, /diceIcon-3x.webp 3x" 
                  alt="Your diceIcon" 
                  className='diceIcon'
                />
              </button>
              <h2>{randomCard.name}</h2>
              <p>Set: {randomCard.set}</p>
              <p>Rarity: {randomCard.rarity}</p>
            </div>
          ) : (
            <p>Loading...</p>
          )
        }
      </div>
    </div>
  );
}

