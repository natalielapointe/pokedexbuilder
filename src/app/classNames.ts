const classes = {
  logo: "h-[95px] w-auto pt-[10px] pl-[10px]",
  contentContainer:
    "flex flex-col items-center justify-center text-center m-[10px]",

  cardSearch: "flex items-center gap-2 mt-8",
  input: "border border-gray-300 rounded px-2 py-1 text-sm w-60 bg-white",
  searchButton:
    "bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm",
  cardResultContainer: "flex flex-col lg:flex-row items-center justify-center",
  pokemonCardImageContainer: "flex flex-col items-center justify-center",
  pokemonCardImage:
    "h-[320px] w-auto rounded-[12px] shadow-[7px_7px_6px_rgba(169,169,169,0.5)]",
  cardGeneratorButton:
    "flex justify-center items-center font-medium text-2xl bg-[#326fbb] text-white rounded-[30px] px-[30px] py-[5px] my-[20px] hover:bg-blue-600 transition-colors duration-300 shadow-[-5px_-5px_6px_#fff,_5px_5px_6px_rgba(0,0,0,0.2)]",
  diceIcon: "h-[25px] w-auto ml-[2px]",
  cardDetailsContainer: "lg:pl-[20px]",
  cardEvolutionInfo:
    "flex flex-row items-center bg-[#ddd] w-fit ml-[20px] rounded-t-[10px] text-[clamp(1rem,2vw,1.3rem)] overflow-hidden",
  cardStage: "bg-[#c9c9c9] shadow-[3px_0_4px_#0002] py-[5px] px-[10px]",
  evolvesFrom: "font-extralight italic py-[5px] px-[10px]",
  cardDetails:
    "bg-white rounded-[5px] max-w-[500px] min-w-[370px] overflow-hidden",
  cardHeader:
    "flex flex-row items-center justify-between pb-[10px] shadow-[0_2px_10px_#0001] px-[20px] py-[10px]",
  cardName: "flex flex-row text-[clamp(1.25rem,2vw,1.5rem)] align-center",
  hpAndType: "flex flex-row [align-items:anchor-center]",
  setSymbol: "h-[20px] w-auto ml-[5px]",
  hpContainer: "pr-[3px]",
  hp: "font-['Space_Mono',monospace] text-[clamp(.75rem,2vw,.9rem)] font-bold",
  hpValue: "text-[clamp(1.5rem,2vw,1.75rem)]",
  cardMoves: "p-[20px]",
  abilityContainer: "pb-[10px]",
  energySymbol: "h-[clamp(1.25rem,2vw,1.5rem)] w-auto",
  attributeIconContainer: "inline-flex items-center gap-1",
  abilityRow: "text-left",
  abilityHeader: "flex-row mb-[5px]",
  abilityType:
    "bg-[#de3c43] text-white px-[10px] mr-[10px] rounded-[10px] italic text-[clamp(.9rem,2vw,1rem)] tracking-[1px]",
  abilityName: "text-[#99131e] text-[clamp(1.125rem,2vw,1.2rem)] bold",
  attackEffect:
    "text-left text-[clamp(.875rem,2vw,.95rem)] font-light leading-[1.3]",
  attackContainer: "pb-[10px]",
  attackRow: "flex items-center justify-between gap-2 py-1 text-sm",
  attackCost: "flex gap-1",
  attackName: "flex-1 text-center text-[clamp(1.125rem,2vw,1.2rem)]",
  attackDamage: "text-[clamp(1.5rem,2vw,1.75rem)] text-right min-w-[40px]",
  cardAttributesContainer:
    "flex flex-row justify-between w-full p-[20px] shadow-[0_0_10px_#0002] relative",
  cardAttribute: "flex flex-col w-full text-[clamp(1rem,2vw,1.25rem)]",
  attributeHeader:
    "underline underline-offset-[3px] text-[clamp(1rem,2vw,1.25rem)] mb-[5px]",
  cardFooter:
    "bg-[#cbcbcb] rounded-b-[5px] text-[clamp(.875rem,2vw,1rem)] p-[20px] flex flex-row justify-between items-stretch",
  cardSet: "text-left text-stroke-3 text-stroke-white paint-order-sf",
};

export default classes;
