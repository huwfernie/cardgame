var pokerUI = pokerUI || {};

pokerUI.setup = function() {

// run this on load!!
  console.log('User Interface loaded');

  this.$playerUpButton = $('#playerUpButton');
  this.$playerDownButton = $('#playerDownButton');
  this.$cardUpButton = $('#cardUpButton');
  this.$cardDownButton = $('#cardDownButton');

  this.$numberOfPlayers = $('#numberOfPlayers');
  this.$numberOfCards = $('#numberOfCards');

  this.$playerUpButton.on('click', ()=> {
    pokerUI.players(1);
  }).bind(this);

  this.$playerDownButton.on('click', ()=> {
    pokerUI.players(-1);
  }).bind(this);

  this.$cardUpButton.on('click', ()=> {
    pokerUI.cards(1);
  }).bind(this);

  this.$cardDownButton.on('click', ()=> {
    pokerUI.cards(-1);
  }).bind(this);

};

pokerUI.players = function players(x){
  console.log('players', x);
  this.temp = parseInt(this.$numberOfPlayers.val());
  this.temp += x;
  this.$numberOfPlayers.val(this.temp);
};

pokerUI.cards = function cards(x){
  console.log('cards', x);
  this.temp = parseInt(this.$numberOfCards.val());
  this.temp += x;
  this.$numberOfCards.val(this.temp);
};

$(pokerUI.setup.bind(pokerUI));
