var poker = poker || {};

poker.setup = function() {

// run this on load!!
  console.log('Huw');

  this.$startButton = $('#startButton');

  this.$startButton.on('click', (e)=> {
    e.preventDefault();
    buildTheDeck();
  }).bind(this);

};

function buildTheDeck(){
  // builds an array of 52 objects, each object represents a card with keys of
  // name, suit, value and image
  // aces low
  console.log('buildTheDeck');
  const deck = [];
  const suits = ['hearts','diamonds','clubs','spades'];
  suits.forEach((suit) => {
    console.log(suit);
    for(let i=1; i<=13; i++) {
      const thisCard = { name: i, suit, value: i, image: `${i}${suit[0]}` };
      deck.push(thisCard);
    }
  });
  shuffle(deck);
}

function shuffle(deck){
  console.log('shuffle');
  // import fisher yates or similar
  console.log(deck);
  deal();
}

function deal() {
  console.log('dealing');
  console.log('done');
  whoWins();
}

function whoWins(){
  console.log('Who wins');
}

$(poker.setup.bind(poker));
