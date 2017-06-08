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
  shuffle();
}

function shuffle(){
  console.log('shuffle');
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
