(function() {

"use strict";

var LOCAL_STORAGE_KEY = "JEOPARDY_GAME_STATE";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

function saveGameState() {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(GAME_STATE));
}

function loadGameState() {
  var gameState = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (gameState) {
    GAME_STATE = JSON.parse(gameState);
  }
}

//------------------------------------------------------------------------------
// HTML
//------------------------------------------------------------------------------

function buildTile (categoryName, tileData, index) {
  var isRevealed = tileData.revealed;
  var html =
  '<li class="clue-tile ' + (isRevealed ? 'revealed' : 'show-amount') + '"' +
      'data-category-index="' + index + '" data-category="' + categoryName + '">' +
    '<span class="amount">$' + tileData.amount + '</span>' +
    '<span class="clue">' + tileData.clue + '</span>' +
    '<span class="answer">' + tileData.answer + '</span>' +
  '</li>';

  return html;
}

function buildCategory (categoryName, items) {
  var html =
    '<li class="category-name">' + categoryName + '</li>' +
    items.map(buildTile.bind(null, categoryName)).join('');

  return '<ul class="category">' + html + '</ul>';
}

function buildBoard (gameState) {
  var categories = Object.keys(gameState);
  var categoriesHtml = categories.map(function(categoryName) {
    return buildCategory(categoryName, gameState[categoryName]);
  }).join('');

  return categoriesHtml;
}

//------------------------------------------------------------------------------
// Events
//------------------------------------------------------------------------------

function clickAmount (el) {
  el.className = 'clue-tile show-clue';
}

function clickClue (el) {
  el.className = 'clue-tile show-answer';
}

function clickAnswer (el) {
  var index = parseInt(el.getAttribute('data-category-index'), 10);
  var category = el.getAttribute('data-category');

  GAME_STATE[category][index].revealed = true;

  saveGameState();

  el.className = 'clue-tile revealed';
}

// Doing some basic event delegation for click events on the game board
function boardClickHandler(event) {
  var clickedEl = event.target;
  var tagName = clickedEl.tagName;

  if (tagName !== 'LI' && tagName !== 'SPAN') return;

  var el = clickedEl;
  if (tagName === 'SPAN') {
    el = clickedEl.parentNode;
  }

  var classList = el.classList;

  if (classList.contains("show-amount")) {
    clickAmount(el);
  }
  else if (classList.contains("show-clue")) {
    clickClue(el);
  }
  else if (classList.contains("show-answer")) {
    clickAnswer(el);
  }
}

function clickReset(event) {
  event.preventDefault();
  localStorage.removeItem(LOCAL_STORAGE_KEY);
  document.location.reload();
}

//------------------------------------------------------------------------------
// Init
//------------------------------------------------------------------------------

function init() {
  loadGameState();

  var boardEl = document.getElementById("board");
  var resetEl = document.getElementById("reset");

  boardEl.innerHTML = buildBoard(GAME_STATE);
  boardEl.addEventListener('click', boardClickHandler);

  resetEl.addEventListener('click', clickReset);
}

window.onload = init;

}());
