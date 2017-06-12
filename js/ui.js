var pokerUI = pokerUI || {};

pokerUI.setup = function() {

// run this on load!!
  console.log('User Interface loaded');

  const $playerUpButton = $('#playerUpButton');
  const $playerDownButton = $('#playerDownButton');
  const $cardUpButton = $('#cardUpButton');
  const $cardDownButton = $('#cardDownButton');

  this.$numberOfPlayers = $('#numberOfPlayers');
  this.$numberOfCards = $('#numberOfCards');

  $playerUpButton.on('click', ()=> {
    pokerUI.players(1);
  }).bind(this);

  $playerDownButton.on('click', ()=> {
    pokerUI.players(-1);
  }).bind(this);

  $cardUpButton.on('click', ()=> {
    pokerUI.cards(1);
  }).bind(this);

  $cardDownButton.on('click', ()=> {
    pokerUI.cards(-1);
  }).bind(this);

};

pokerUI.players = function players(x){
  console.log('players', x);
  let temp = parseInt(this.$numberOfPlayers.html());
  temp += x;
  temp <= 0 ? temp = 1 : null;
  temp >= 52 ? temp = 52 : null;
  this.$numberOfPlayers.html(temp);
};

pokerUI.cards = function cards(x){
  console.log('cards', x);
  let temp = parseInt(this.$numberOfCards.html());
  temp += x;
  temp <= 0 ? temp = 1 : null;
  temp >= 52 ? temp = 52 : null;
  this.$numberOfCards.html(temp);
};

$(pokerUI.setup.bind(pokerUI));
