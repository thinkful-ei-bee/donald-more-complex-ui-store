'use strict';
/*global cuid*/

// `STORE` is responsible for storing the underlying data
// that our app needs to keep track of in order to work.
//
// for a shopping list, our data model is pretty simple.
// we just have an array of shopping list items. each one
// is an object with a `name` and a `checked` property that
// indicates if it's checked off or not.
// we're pre-adding items to the shopping list so there's
// something to see when the page first loads.

const STORE = {
  items: [
    {id: cuid(), name: "apples", checked: false, searched: false},
    {id: cuid(), name: "oranges", checked: false, searched: false},
    {id: cuid(), name: "milk", checked: true, searched: false},
    {id: cuid(), name: "bread", checked: false, searched: false}
  ],
  hideCompleted: false,
  search: false
};


function generateItemHTML(item){
  return `
  <li data-item-id="${item.id}"> <span class="shopping-item ${item.checked ? 'shopping-item__checked' : ''}">${item.name}</span> <div class="shopping-item-controls"> <button class="shopping-item-toggle js-item-toggle"> <span class="button-label">check</span> </button> <button class="shopping-item-delete js-item-delete"> <span class="button-label">delete</span> </button> </div> </li>
  `;
}

function generateItemsHTML(arr){
  const htmlArr = arr.map(generateItemHTML);
  return htmlArr.join('');
}

function generateItem(item){
  return {id: cuid(), name: item, checked: false};
}

function addItemToShoppingList(item){
  STORE.items.push(generateItem(item));
}

function getItemIdFromElement(element){
  return $(element)
    .closest('li')
    .data('item-id');
}

function toggleCheckedForListItem(id){
  const item = STORE.items.find(item => item.id === id);
  item.checked = !item.checked; 
}

function toggleSearchForListItem(id){
  const item = STORE.items.find(item => item.id === id);
  item.searched = !item.searched; 
}

function deleteItemFromList(id){
  const index = STORE.items.findIndex(item => item.id === id);
  if (index === -1) return;
  STORE.items.splice(index,1);
}

function renderShoppingList() {
  // this function will be responsible for rendering the shopping list in
  // the DOM
  console.log('`renderShoppingList` ran');
  let filteredItems = STORE.items;

  // if the `hideCompleted` property is true, then we want to reassign filteredItems to a version
  // where ONLY items with a "checked" property of false are included
  if (STORE.hideCompleted) {
    filteredItems = filteredItems.filter(item => !item.checked);
  }

  if (STORE.search) {
    filteredItems = filteredItems.filter(item => item.searched);
  }

  const htmlString = generateItemsHTML(filteredItems);
  $('.js-shopping-list').html(htmlString);

}


function handleNewItemSubmit() {
  // this function will be responsible for when users add a new shopping list item
  console.log('`handleNewItemSubmit` ran');
  $('#js-shopping-list-form').on('submit',function(e){
    console.log('Submitting...');
    e.preventDefault();
    console.log(e);
    addItemToShoppingList($('.js-shopping-list-entry').val());
    $('.js-shopping-list-entry').val('');
    renderShoppingList();
  });
}


function handleItemCheckClicked() {
  // this function will be responsible for when users click the "check" button on
  // a shopping list item.
  console.log('`handleItemCheckClicked` ran');
  $('.js-shopping-list').on('click','.js-item-toggle',function(e){
    const id = getItemIdFromElement(e.currentTarget);
    toggleCheckedForListItem(id);
    renderShoppingList();
  });
}


function handleDeleteItemClicked() {
  // this function will be responsible for when users want to delete a shopping list
  // item
  console.log('`handleDeleteItemClicked` ran');
  $('.js-shopping-list').on('click','.js-item-delete',function(e){
    const id = getItemIdFromElement(e.currentTarget);
    console.log(id);
    deleteItemFromList(id);
    console.log(STORE.items);
    renderShoppingList();
  });
}

// Toggles the STORE.hideCompleted property
function toggleHideFilter() {
  STORE.hideCompleted = !STORE.hideCompleted;
}

// Places an event listener on the checkbox for hiding completed items
function handleToggleHideFilter() {
  $('.js-hide-completed-toggle').on('click', () => {
    toggleHideFilter();
    renderShoppingList();
  });
}

// Places an event listener on the search bar 
function handleSearch() {
  console.log('`handleSearch` ran');
  $('#js-shopping-list-search').on('submit', function(e){
    e.preventDefault();
    STORE.search = true;
    let matchedCUIDs = cuidLookup($('.js-shopping-list-search').val());
    matchedCUIDs.map(id => toggleSearchForListItem(id));
    $('.js-shopping-list-search').val('');
    renderShoppingList();
  });
}

// Looks up CUID values based on search argument and sets search toggle in STORE object to true
function cuidLookup(search) {
  let matchedItem = STORE.items.filter(x => x.name.toLowerCase().includes(search.toLowerCase()));
  return matchedItem.map(items => items.id);
}

// function handleNewItemSubmit() {
//   // this function will be responsible for when users add a new shopping list item
//   console.log('`handleNewItemSubmit` ran');
//   $('#js-shopping-list-form').on('submit',function(e){
//     console.log('Submitting...');
//     e.preventDefault();
//     console.log(e);
//     addItemToShoppingList($('.js-shopping-list-entry').val());
//     $('.js-shopping-list-entry').val('');
//     renderShoppingList();
//   });
// }

// this function will be our callback when the page loads. it's responsible for
// initially rendering the shopping list, and activating our individual functions
// that handle new item submission and user clicks on the "check" and "delete" buttons
// for individual shopping list items.
function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleToggleHideFilter();
  handleSearch();
}

// when the page loads, call `handleShoppingList`
$(handleShoppingList);