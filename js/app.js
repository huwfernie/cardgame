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
  /* builds an array of 52 objects, each object represents a card with keys of
  name, suit, value and image
  aces low */
  console.log('buildTheDeck');
  const deck = [];
  const suits = ['hearts','diamonds','clubs','spades'];
  suits.forEach((suit) => {
    for(let i=1; i<=13; i++) {
      const thisCard = { name: i, suit, value: i, image: `${i}${suit[0]}` };
      deck.push(thisCard);
    }
  });
  return shuffle(deck);
}


function shuffle(array) {
  /* This is a fisher-Yates shuffle algorithm, released under the
  Apache License and taken from github via stack overflow:
  https://github.com/coolaj86/knuth-shuffle
  */
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  // console.log('shuffled', array);
  return deal(array);
}

function deal(deck) {
  /*
  Takes an input of the deck (array of objects) then finds number of players and size of hand from the
  input boxes on the HTML, checks there are enough cards in the deck and then 'deals' each player a hand
  of cards

  output is an array (of players) filled with arrays (hands of cards)
  */
  const $numberOfPlayers = $('#numberOfPlayers').val();
  const $numberOfCards = $('#numberOfCards').val();
  console.log(`Dealing ${$numberOfPlayers} players with ${$numberOfCards} cards`);
  if(deck.length < ($numberOfCards * $numberOfPlayers)) {
    console.log('their aren\'t enough cards for this game');
    return;
  } else {
    const players = [];
    for(let i=1; i<=$numberOfPlayers; i++) {
      console.log(`player${i}`);
      const thisPlayer = new Array();
      const x = i*$numberOfCards;
      const y = x-$numberOfCards;
      thisPlayer.push(deck.slice(y,x));
      players.push(thisPlayer);
      // console.log(`player${i}, ${y}, ${x}`);
      // console.log(thisPlayer);
    }
    console.log('done', players);
    return whoWins(players);
  }
}

function whoWins(){
  console.log('Who wins');
  const $winner = $('.winner');
  return $winner.html('Hello');
}

$(poker.setup.bind(poker));
