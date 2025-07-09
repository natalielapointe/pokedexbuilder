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
        style={{ height: '85px', width: 'auto', margin: '10px 0 0 10px' }}
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
              <button className='flex items-center justify-center bg-blue-500 text-white rounded-lg px-4 py-2 mt-4 mb-2 hover:bg-blue-600 transition-colors duration-300 kanit font-medium'>
                Random
                <img 
                  src="/diceIcon-1x.webp" 
                  srcSet="/diceIcon-1x.webp 1x, /diceIcon-2x.webp 2x, /diceIcon-3x.webp 3x" 
                  alt="Your diceIcon" 
                  style={{ height: '21.4px', width: 'auto', margin: '0 0 5px 0' }}
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

