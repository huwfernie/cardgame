var pokerUI = pokerUI || {};

pokerUI.setup = function() {

// run this on load!!
  console.log('User Interface');

  this.$playerUpButton = $('#playerUpButton');
  this.$playerDownButton = $('#playerDownButton');
  this.$cardUpButton = $('#cardUpButton');
  this.$cardDownButton = $('#cardDownButton');

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

pokerUI.cards = function cards(x){
  return console.log('cards', x);
};

pokerUI.players = function players(x){
  return console.log('players', x);
};



$(pokerUI.setup.bind(pokerUI));
