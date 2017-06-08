var poker = poker || {};

poker.setup = function() {

// run this on load!!
  console.log('Huw');

  this.$startButton = $('#startButton');

  this.$startButton.on('click', (e)=> {
    e.preventDefault();
    poker.buildTheDeck();
  }).bind(this);

};

poker.buildTheDeck = function buildTheDeck(){
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
  return poker.shuffle(deck);
};


poker.shuffle = function shuffle(array) {
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
  return poker.deal(array);
};

poker.deal = function deal(deck) {
  /*
  Takes an input of the deck (array of objects) then finds number of players and size of hand from the
  input boxes on the HTML, checks there are enough cards in the deck and then 'deals' each player a hand
  of cards

  output is an array (of players) filled with objects (players),
  each player has keys of : name, score, hand(array of card objects)
  */
  const $numberOfPlayers = $('#numberOfPlayers').val();
  const $numberOfCards = $('#numberOfCards').val();

  console.log(`Dealing ${$numberOfPlayers} players with ${$numberOfCards} cards`);

  if(deck.length < ($numberOfCards * $numberOfPlayers)) {
    // could make this an error message or alert.
    console.log('their aren\'t enough cards for this game');
    return;
  } else {
    const players = [];
    for(let i=1; i<=$numberOfPlayers; i++) {
      const name = `player${i}`;
      const thisPlayer = {};
      const x = i*$numberOfCards;
      const y = x-$numberOfCards;

      thisPlayer.name = name;
      thisPlayer.hand = (deck.slice(y,x));
      thisPlayer.score = 0;
      players.push(thisPlayer);
    }
    console.log('done', players);
    return poker.getScores(players);
  }
};

poker.getScores = function getScores(players){
  /*Loop through all players, then each card in that players hand, add the card.value
  to the cumulative player.score*/
  console.log('Get Scores');
  players.forEach((player) => {
    player.hand.forEach((card) => {
      player.score += card.value;
    });
  });

  return poker.whoWins(players);
};

poker.whoWins = function whoWins(players){
  /* loop through players array, if the score is highest replace the temp winner
  and winning score with current values, then pass info to the finish function to
  display data on screen.*/
  console.log('Who wins');

  let winner = 'No one';
  let winners = [];
  let winningScore = 0;
  let draw = false;

  for(let i=0; i<players.length; i++) {
    const player = players[i];
    console.log(player.name, ' : ', player.score);
    if(player.score === winningScore) {
      winners.push(player.name);
      draw = true;
    }
    if(player.score > winningScore) {
      winner = player.name;
      winningScore = player.score;
      draw = false;
      winners = [];
    }
  }

  return poker.finish(winner, draw, winners);
};

poker.finish = function finish(winner, draw, winners) {
  /* find HTML with class ".winner" and fill it with the name of the winning player*/
  const $winner = $('.winner');

  if(draw) {
    $winner.html('It\'s a draw!!!');
    $winner.after('<ul></ul>');
    winners.forEach((winner)=> {
      $('ul').after(`<li>${winner}</li>`);
    });


  } else {
    return $winner.html(`winner is : ${winner}`);
  }
};

$(poker.setup.bind(poker));
