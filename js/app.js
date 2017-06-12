var poker = poker || {};

poker.setup = function() {

// run this on load!!
  console.log('app.js loaded');

  const $startButton = $('#startButton');
  const $resetButton = $('#resetButton');

  $startButton.on('click', (e)=> {
    e.preventDefault();
    poker.clearResults();
    poker.checkInput();
  }).bind(this);

  $resetButton.on('click', (e)=> {
    e.preventDefault();
    poker.clearResults();
  }).bind(this);
};

poker.checkInput = function checkInput(){
  /* Check to see if input values are within 1-52 range*/
  const $numberOfPlayers = parseInt($('#numberOfPlayers').html());
  const $numberOfCards = parseInt($('#numberOfCards').html());

  if ($numberOfCards >=1 && $numberOfCards <= 52 && $numberOfPlayers >= 1 && $numberOfPlayers <= 52){
    return poker.buildTheDeck();
  } else {
    return alert('Change your player and card numbers and try again');
  }
};

poker.buildTheDeck = function buildTheDeck(){
  /* builds an array of 52 objects, each object represents a card with keys of
  name, suit, value, deckValue and image
  aces low */
  console.log('buildTheDeck');
  const deck = [];
  const suits = ['hearts','diamonds','clubs','spades'];
  suits.forEach((suit) => {
    for(let i=1; i<=13; i++) {
      const name = i + suit[0];
      const thisCard = { name, suit, value: i, deckValue: i, image: `${i}${suit[0]}.svg` };
      deck.push(thisCard);
    }
  });

  /* This adds a multiple of 13 to each card based on its' suit so that all the cards in
  the deck now have a unique descending value from king of Hearts(52) to ace of clubs(1)*/
  deck.forEach((card) =>{
    if(card.suit === 'hearts'){
      card.deckValue = card.value + (39);
    } else if(card.suit === 'spades') {
      card.deckValue = card.value + (26);
    } else if(card.suit === 'diamonds') {
      card.deckValue = card.value + (13);
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
  Takes an input of the deck (array of objects) then reads number of players and size of hand from the
  input boxes on the HTML, checks there are enough cards in the deck and then 'deals' each player a hand
  of cards

  output is an array (of players) filled with objects (players),
  each player has keys of : name, score, hand(array of card objects)
  */
  const $numberOfPlayers = $('#numberOfPlayers').html();
  const $numberOfCards = $('#numberOfCards').html();

  console.log(`Dealing ${$numberOfPlayers} players with ${$numberOfCards} cards`);

  if(deck.length < ($numberOfCards * $numberOfPlayers)) {
    // could make this an error message or alert.
    console.log('their aren\'t enough cards for this game');
    return alert('their aren\'t enough cards for this game');
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
    // console.log('done', players);

    return poker.getScores(players);
  }
};

poker.getScores = function getScores(players){
  /* Loop through all players, then each card in that players hand, add the card.value
  to the cumulative player.score */
  console.log('Get Scores');
  players.forEach((player) => {
    player.hand.forEach((card) => {
      player.score += card.value;
    });
  });

  return poker.bonusPoints(players);
  // use "return poker.display(players);" if you don't want bonus points for straight/3ofaKind/pair
};

poker.bonusPoints = function bonusPoints(players) {
  // sort each players hand by the card value
  console.log('Bonus Points');
  players.forEach((player)=> {
    player.hand.sort(function(a,b) {
      return a.value - b.value;
    });
  });

  /* create a new array called "handValues" that just holds the values of each players cards
  index[0] will have the highest card value */
  players.forEach((player)=> {
    player.handValues = [];
    player.hand.forEach((card) => {
      player.handValues.push(card.value);
    });
    player.handValues.reverse();
    // console.log(player.handValues);
  });

  /* loop through all players, call testStraight with each player, and 13 as the second
  argument (highest card value), testStraight will then call testThreeOfAKind and that will call
  testTwoPair and then return here for the next player */
  players.forEach((player) => {
    // console.log('checking for bonus points : ', player.name);
    poker.testStraight(player, 13);
  });

  // display(players) will display each player and their cards on screen
  return poker.display(players);
};

poker.testStraight = function testStraight(player, highestValue) {
  // console.log('testing for straight',player.handValues);
  // i,j,k,l,m are used in the next for loop 5,4,3,2,1 => i,j,k,l,m
  for(let i=highestValue; i>=5; i--) {
    const j = i-1;
    const k = j-1;
    const l = k-1;
    const m = l-1;

    // check to see if handValues includes 5 consecutive numbers
    if((player.handValues.includes(i)) &&
      (player.handValues.includes(j)) &&
      (player.handValues.includes(k)) &&
      (player.handValues.includes(l)) &&
      (player.handValues.includes(m))) {
      // console.log('found a straight');

      // +40 for points for a straight
      player.score += 40;
      // remove any cards used in a straight, in reverse order
      [m,l,k,j,i].forEach((element)=> {
        const index = player.handValues.indexOf(element);
        player.handValues.splice(index,1);
      });
      // start again if you get a straight, from the index we already checked up to.
      return poker.testStraight(player, i);
    }
  }
  // finished testing for straights, now testing for 3 of a kind
  return poker.testThreeOfAKind(player, 0);
};

poker.testThreeOfAKind = function testThreeOfAKind(player, index) {
  // console.log('testing for three ',player.handValues);
  // i,j,k are used in the next for loop [5,4,3] => [i,j,k]
  if(player.handValues.length >= 3){
    for(let i=index; i<=player.handValues.length-3; i++) {
      const j = i+1;
      const k = j+1;

      // if cards at index i, j & k have the same value then you have 3 of a kind
      if((player.handValues[i] === player.handValues[j]) && (player.handValues[j] === player.handValues[k])) {
        // console.log('found Three of a kind');

        // +20 for points for a three of a kind
        player.score += 20;
        // remove any cards used in a three of a kind
        player.handValues.splice(i,3);
        // look again for another 3 of a kind, from the index you already searched to.
        return poker.testThreeOfAKind(player, i);
      }
    }
  }
  // checked all options, now check for two pair:
  return poker.testTwoPair(player, 0);
};

poker.testTwoPair = function testTwoPair(player, index) {
  // console.log('testing for pair ',player.handValues);
  // i,j,k are used in the next for loop [5,4,3] => [i,j,-]
  if(player.handValues.length >= 2){
    for(let i=index; i<=player.handValues.length-2; i++) {
      const j = i+1;

      if(player.handValues[i] === player.handValues[j]) {
        // console.log('found Two Pair');

        // +10 for points for a pair
        player.score += 10;
        // remove any cards used in a pair
        player.handValues.splice(i,2);
        // look again for another pair, from the index you already searched to.
        return testTwoPair(player, i);
      }
    }
  }
  // console.log('done');
  // return will take you back to poker.bonusPoints, where you call poker.testStraight
  return;
};

poker.display = function display(players){
  /*
  Takes the players array,

  sort each players' hand array by the cards deckValue,

  loops through players array creating an HTML <div> for each player with another <div> for each card in the players hand.
  */

  console.log('Display');
  /* This sorts each players hand of cards into order of suit and then value */
  players.forEach((player) => {
    player.hand.sort(function(a,b){
      return b.deckValue - a.deckValue;
    });
  });

  const $players = $('.players');
  players.forEach((player) => {
    $players.append(`<div class="player" id="${player.name}"><h2>${player.name}, Score : ${player.score}</h2></div>`);
    player.hand.forEach((card)=>{
      $(`#${player.name}`).append(`<div class="card" id="${card.name}" style="background-image: url('./images/${card.image}');"></div>`);
    });
  });
  //
  return poker.whoWins(players);
};

poker.whoWins = function whoWins(players){
  /* 1st - arrange players array (using .sort) in order of players scores, so
  players[0] will be the player with the highest score

  add player[0]'s name to the new array - winners

  loop through all other players in the array, if any have a matching score to player[0]
  then add their name to the winners array too.

  call poker.finish and pass in the array of winning names*/
  console.log('Who wins');

  players.sort(function(a,b){
    return b.score - a.score;
  });

  const winners = [players[0]];

  for(let i=1; i<players.length; i++) {
    //console.log(i);
    if(players[i].score === players[0].score) {
      winners.push(players[i]);
    }
  }
  return poker.finish(winners);
};

poker.finish = function finish(winners) {
  // console.log('finish');
  /* find HTML with class ".winner"

  if more than one name in the winners array create a list with each name

  if only one name in winners then display it
  */
  const $winner = $('.winner');

  // sort the winners by the deckValue of the first card in their hand
  // console.log('finish', winners);
  console.log('finish');
  winners.sort(function(a,b) {
    return b.hand[0].deckValue - a.hand[0].deckValue;
  });

  // so winners[0] now has to have the highest trump card.
  if(winners.length>1) {
    $winner.html('It\'s a draw!!! <ul></ul>');
    $('ul').after(`<li>But our winner by suit is ${winners[0].name}</li>`);
    winners.forEach((winner)=> {
      $('ul').append(`<li>${winner.name}</li>`);
    });
  } else {
    return $winner.html(`and the winner is... ${winners[0].name}`);
  }
};

/* Used to clear the results section of the display, for a new game */
poker.clearResults = function clearResults() {
  // console.log('clear');
  const $players = $('.players');
  $players.empty();
  const $winner = $('.winner');
  $winner.html('Who will win???');
  return;
};

$(poker.setup.bind(poker));
