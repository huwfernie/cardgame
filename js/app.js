var poker = poker || {};

poker.setup = function() {

// run this on load!!
  console.log('Huw - app.js loaded');

  const $startButton = $('#startButton');
  const $resetButton = $('#reset');

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
  const $numberOfPlayers = parseInt($('#numberOfPlayers').val());
  const $numberOfCards = parseInt($('#numberOfCards').val());

  if ($numberOfCards >=1 && $numberOfCards <= 52 && $numberOfPlayers >= 1 && $numberOfPlayers <= 52){
    return poker.buildTheDeck();
  } else {
    return alert('Change your player and card numbers and try again');
  }
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
      const name = i + suit[0];
      const thisCard = { name, suit, value: i, deckValue: i, image: `${i}${suit[0]}` };
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
    console.log('done', players);
    return poker.getScores(players);
  }
};

poker.getScores = function getScores(players){
  /*Loop through all players, then each card in that players hand, add the card.value
  to the cumulative player.score */
  console.log('Get Scores');
  players.forEach((player) => {
    player.hand.forEach((card) => {
      player.score += card.value;
    });
  });

  // const copyOfPlayers = $.extend(true, [], players);
  // poker.display(copyOfPlayers);
  return poker.bonusPoints(players);
};

poker.bonusPoints = function bonusPoints(players) {
  players.forEach((player)=> {
    player.hand.sort(function(a,b) {
      return a.value - b.value;
    });
  });

  const localCopyOfPlayers = $.extend(true, [], players);

  localCopyOfPlayers.forEach((player,index) => {
    console.log('hand',player.hand);
    // g,h,i are counters in the next for loop
    for(let i=player.hand.length-1; i>=1; i--) {
      const h = i-1;
      const g = h-1;

      if(i >=4) {
        console.log('trying straight');
        if(player.hand[i].value === player.hand[i-1].value+1 &&
            player.hand[i].value === player.hand[i-2].value+2 &&
            player.hand[i].value === player.hand[i-3].value+3 &&
            player.hand[i].value === player.hand[i-4].value+4) {
          console.log('win', player.hand[i].value);
          player.score += 40; // +40 for a straight = [1,2,3,4,5]
          player.hand.splice(i-4,5);
        }
      } else if(i >=2) {
        console.log('trying 3 of a kind');
        if(player.hand[g].value === player.hand[h].value && player.hand[h].value === player.hand[i].value) {
          console.log('win', player.hand[g].value);
          player.score += 20; // +20 for 3 of a kind
          player.hand.splice(g,3);
        }
      } else if(player.hand[h].value === player.hand[i].value) {
        console.log('pair', player.hand[h].value);
        player.score = player.score+10;
        console.log(players[index].score);// += 10; // +10 for a pair
        player.hand.splice(h,2);
      }
    }
  });


  players.forEach((player,index)=> {
    player.score = localCopyOfPlayers[index].score;
  });

  poker.display(players);
  return poker.whoWins(players);
};



poker.whoWins = function whoWins(players){
  /* 1st - arrange players array (using .sort) in order of players scores, so
  players[0] will be the highest score

  add player[0]'s name to the new array - winners

  loop through all other players in the array, if any have a matching score to player[0]
  then add their name to the winners array too.

  call poker.finish and pass in the array of winning names*/
  console.log('Who wins',players);

  players.sort(function(a,b){
    return b.score - a.score;
  });

  const winners = [players[0]];

  for(let i=1; i<players.length; i++) {
    console.log(i);
    if(players[i].score === players[0].score) {
      winners.push(players[i]);
    }
  }
  return poker.finish(winners);
};

poker.finish = function finish(winners) {
  console.log('finish');
  /* find HTML with class ".winner"

  if more than one name in the winners array create a list with each name

  if only one name in winners then display it

  a new game will overwrite the old result.
  */
  const $winner = $('.winner');

  // sort each winner(s) hands by deckValue
  // this is already done!

  // sort the winners by the deckValue of the first card in their hand
  console.log('sorted winners hands', winners);
  winners.sort(function(a,b) {
    return b.hand[0].deckValue - a.hand[0].deckValue;
  });

  // so winners[0] now has to have the highest trump card.
  if(winners.length>1) {
    $winner.html('It\'s a draw!!! <ul></ul>');
    $('ul').after(`<li>But our winner by suit is ${winners[0].name}</li>`);
    winners.forEach((winner)=> {
      $('ul').after(`<li>${winner.name}</li>`);
    });
  } else {
    return $winner.html(`winner is : ${winners[0].name}`);
  }
};

/* Used to clear the results section of the display, for a new game */
poker.clearResults = function clearResults() {
  console.log('clear');
  const $players = $('.players');
  $players.empty();
  return console.log('done');
};

poker.display = function display(copyOfPlayers){
  /*
  Takes an unsorted copy of the players array,

  sort each players' hand array by the cards deckValue,

  loops through players array creating an HTML <div> for each player with another <div> for each card in the players hand.
  */
  console.log('copy',copyOfPlayers);

  /* This sorts each players hand of cards into order of suit and then value */
  copyOfPlayers.forEach((player) => {
    player.hand.sort(function(a,b){
      return b.deckValue - a.deckValue;
    });
  });

  const $players = $('.players');
  copyOfPlayers.forEach((player) => {
    $players.append(`<div class="player" id="${player.name}"><h2>${player.name}, Score : ${player.score}</h2></div>`);
    player.hand.forEach((card)=>{
      $(`#${player.name}`).append(`<div class="card" id="${card.name}" style="background-image: url('./images/${card.name}.svg');"></div>`);
    });
  });
};

$(poker.setup.bind(poker));
