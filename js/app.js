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
  console.log('buildTheDeck');
  const deck = [];
  for(let i=1; i<=13; i++) {
    const thisCard = { name: 'ace', suit: 'hearts', value: i, image: `${i}h` };
    deck.push(thisCard);
  }
  shuffle(deck);
}

function shuffle(deck){
  console.log('shuffle');
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
