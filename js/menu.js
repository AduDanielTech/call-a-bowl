


let SWALLOW_OPTION;
// Your JSON data
let jsonData;


/* local storage */
let cart = [];

// Function to initialize the cart from local storage
function initializeCartFromLocalStorage() {
  const cartData = localStorage.getItem('cart');

  if (cartData) {
    cart = JSON.parse(cartData);
  }
}

// Function to save the cart to local storage
function saveCartToLocalStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}


function removeFromCart(itemIndex) {
  // Your existing code...

  // After removing an item from the cart, save the updated cart to local storage
  saveCartToLocalStorage();
}


function addDashes(str) {
  // Use a regular expression to replace spaces with dashes globally
  return str.replace(/\s+/g, '_');
}

// Function to fetch and load JSON data from an external file
async function loadJSONData() {
    try {
        const response = await fetch('./file.json'); // Replace with the correct path to your JSON file
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        jsonData = await response.json();  
    
    } catch (error) {
        console.error('Error loading JSON data:', error);
    }
}

// Function to populate the HTML structure
function populateMenu() {
  initializeCartFromLocalStorage();
    const menuTitlesCont = document.querySelector('.menu_titles_cont');
    const menuItemsCont = document.querySelector('.menu_item');
    const menuOverlayDrinks = document.querySelector('.menu_product_drink_checkbox');

    jsonData.MENU.forEach((category) => {
        for (const categoryName in category) {
          if (category[categoryName] == category["SWALLOW_OPTION"]) {
            SWALLOW_OPTION = category["SWALLOW_OPTION"]            
            break;
          }
          
            // Create and append the title div
            menuTitlesCont.appendChild(createTitleDiv(categoryName));

            // Create a container for menu items in this category
            const categoryContainer = document.createElement('section');
            categoryContainer.classList.add('menu_main_cont');
            categoryContainer.id = addDashes(categoryName)
            categoryContainer.setAttribute('data-id', categoryName);



            const titleHeader =  createTitleHeader(categoryName)
            categoryContainer.appendChild(titleHeader)
          

            // Loop through the menu items in the category and append them to the category container
            category[categoryName].forEach((menuItem) => {
                categoryContainer.innerHTML += createMenuItemFromApi(menuItem, categoryName);
            });

        
            if (category[categoryName] == category["DRINKS"]) {
              
              category["DRINKS"].map((menuItem) => {
                  menuOverlayDrinks.innerHTML += createDrinksLabel(menuItem);
              });
            }


            
            menuItemsCont.appendChild(categoryContainer);
        }
    });
}





// Function to create a title div
function createTitleDiv(titleText) {
    const titleDiv = document.createElement('a');
    titleDiv.href = `#${addDashes(titleText)}`;
    titleDiv.classList.add('menu_title');
    titleDiv.classList.add('menu-link');
    titleDiv.textContent = titleText;
    return titleDiv;
}

function createTitleHeader(titleText) {
  const itemMenuName = document.createElement('div');
  itemMenuName.classList.add('item_menu_name'); 
  itemMenuName.textContent += titleText
    return itemMenuName;
}

// Function to create a menu item from API div
function createMenuItemFromApi(menuData, categoryName) {
  const existingItem = cart.find(item => item.itemTitle === menuData.MENU);
  let quantity
  if (existingItem) {
    quantity = existingItem.quantity
  }
  var formattedNumber = menuData.PRICE.toLocaleString();
    const menuItemDiv = `
        <div class="menu_item_from_api" data-menu="${categoryName}">
            <img src="./images/menu_images/spag_chicked.png" alt="" loading="lazy" class="menu_item_image">
            <div class="item_name_cont">
                <div class="item_name">
                    <p class="item_name_text">${menuData.MENU}</p>
                    <span class="orange-bg ${existingItem ? ' ': 'dont_show'}">${
               quantity
                    }</span>
                </div>
                <div class="item_price"> ₦ <p class="item_price_text">${formattedNumber}</p> <span style="display: none;" class="material-symbols-outlined add_box_google">add_box</span></div>
            </div>
        </div>
    `;

    return menuItemDiv;
}

function createDrinksLabel(menuData) {
  const  overlayLabel =
  `
  <label class="menu_product_drinks_checkbox_container label" >
  <p>${menuData.MENU}</p>
  <input  type="checkbox" data-price="${menuData.PRICE}" >
  <span class="menu_product_drinks_checkbox_checkmark "></span>
</label>
  `
   return overlayLabel;
}

function incrementClickedItem(itemClicked) {
  itemClicked.quantity++
  itemClicked.total_price = itemClicked.quantity  * itemClicked.default_price;
}
function decrementClickedItem(itemClicked) {
  itemClicked.quantity--
  itemClicked.total_price = itemClicked.quantity  * itemClicked.default_price;
}

document.addEventListener('DOMContentLoaded', () => {
  loadJSONData()
  .then(() => {
    
      
    
    initializeCartFromLocalStorage();
     if (window.location.href.includes("menu.html")) {
      
    showCartBottomOverlay(cart)
       populateMenu();
       const cartItemsCont = document.querySelector('.cart_overlay_items');
       const cartOverlayTotalText = document.querySelector('.cart_overlay_checkout_total_text');      
       populateCartOverlay(cart,cartItemsCont,cartOverlayTotalText)
      
    
    const menuItems = document.querySelectorAll(".menu_title");
    const menuItemsCont = document.querySelector(".menu_titles_cont");


    function setActiveMenuItem() {
      const menuItems = document.querySelectorAll(".menu_title");
      const menuItemsCont = document.querySelector(".menu_titles_cont");
    
      // Get the position of the menu container and the window's scroll position
      const menuItemsContRect = menuItemsCont.getBoundingClientRect();
      const scrollY = window.scrollY || window.pageYOffset;
    
      // Calculate the position at which the active class should be added
      const activePosition = scrollY + menuItemsContRect.height / 2;
    
      // Loop through each menu item and add/remove the active class accordingly
      menuItems.forEach((link) => {
        const id = link.getAttribute("href").slice(1);
        const element = document.getElementById(id);
        const elementRect = element.getBoundingClientRect();
    
        // Check if the content associated with the menu item is in the view
        if (
          elementRect.top <= activePosition &&
          elementRect.bottom >= activePosition
        ) {
          menuItems.forEach((item) => {
            item.classList.remove("active_title");
          });
          link.classList.add("active_title");
        }

      });
    }
       // Call the function on page load and scroll events
      //  window.addEventListener("load", setActiveMenuItem);
      //  window.addEventListener("scroll", setActiveMenuItem);
    menuItems.forEach((link) => {
      link.addEventListener("click", (e) => {
       menuItems.forEach((item) => {
         item.classList.remove('active_title');
       });
       link.classList.add('active_title');
        e.preventDefault();
 
        const id = e.currentTarget.getAttribute("href").slice(1);
        const element = document.getElementById(id);
        const navHeight = navbar.getBoundingClientRect().height;
        const menuItemsHeight = menuItemsCont.getBoundingClientRect().height;
        const containerHeight = linksContainer.getBoundingClientRect().height;
        
        
        const fixedNav = navbar.classList.contains("fixed-nav");
        let position = element.offsetTop - (navHeight + menuItemsHeight);
        
        if (!fixedNav) {
          position = position - navHeight;
    
          
        }
        if (navHeight > 82) {
          position = position - containerHeight;
        }
    
        window.scrollTo({
          left: 0,
          top: position,
        });
        // close
        
      });
    }); 
   const menuArticleToClick = document.querySelectorAll(".menu_item_from_api")
   menuArticleToClick.forEach(async (article)  => {
   await article.addEventListener("click", () => {
      clickOnItem(article)
    })









    if (window.location.hash) {
      let hash = window.location.hash      
      var targetElement = document.getElementById(hash.substring(1));
      const navHeight = navbar.getBoundingClientRect().height;
        const menuItemsHeight = menuItemsCont.getBoundingClientRect().height;
      if (targetElement) {
        let position = targetElement.offsetTop + (navHeight + menuItemsHeight);
        position= position - 400
        window.scrollTo({
          left: 0,
          top: position,
        });
      }
    }
  
   
   })




   
  
  const totalProductPrice = document.querySelector('.cart_overlay_item_product_price_text');
  const productQuantity = document.querySelector('.cart_overlay_item_product_quantity_cont');
  const increment_overlayBtn = document.querySelectorAll('.cart_overlay_increment_quantity');
  const decrement_overlayBtn = document.querySelectorAll('.cart_overlay_decrement_quantity');
  const removeBtns = document.querySelectorAll('.cart_overlay_item_remove_btn');
  let itemName;


// Add a single click event listener to the parent
cartItemsCont.addEventListener('click', (e) => {
  const target = e.target;
  

  
  // Check if the clicked element is an increment button
  if (target.parentElement.classList.contains('cart_overlay_increment_quantity')) {
    itemName = target.parentElement.parentElement.parentElement.parentElement.dataset.title;
    incrementCartItem(itemName);
  }
   if (target.parentElement.parentElement.classList.contains('cart_overlay_increment_quantity')) {
    itemName = target.parentElement.parentElement.parentElement.parentElement.dataset.title;
    
    incrementCartItem(itemName);
  }
   if (target.parentElement.parentElement.parentElement.classList.contains('cart_overlay_increment_quantity')) {
    itemName = target.parentElement.parentElement.parentElement.parentElement.dataset.title;
    
    incrementCartItem(itemName);
  }
   if (target.parentElement.parentElement.parentElement.parentElement.classList.contains('cart_overlay_increment_quantity')) {
    itemName = target.parentElement.parentElement.parentElement.parentElement.parentElement.dataset.title;
    
    incrementCartItem(itemName);
  }

  // Check if the clicked element is a decrement button
  if (target.parentElement.classList.contains('cart_overlay_decrement_quantity')) {
    itemName = target.parentElement.parentElement.parentElement.parentElement.dataset.title;
    
    decrementCartItem(itemName);
  }
  if (target.parentElement.classList.contains('cart_overlay_decrement_quantity')) {
    
    itemName = target.parentElement.parentElement.parentElement.parentElement.dataset.title;
    decrementCartItem(itemName);
  }
  if (target.parentElement.parentElement.classList.contains('cart_overlay_decrement_quantity')) {
    
    itemName = target.parentElement.parentElement.parentElement.parentElement.dataset.title;
    decrementCartItem(itemName);
  }
  if (target.parentElement.parentElement.parentElement.classList.contains('cart_overlay_decrement_quantity')) {
    
    itemName = target.parentElement.parentElement.parentElement.parentElement.dataset.title;
    decrementCartItem(itemName);
  }

  // Check if the clicked element is a remove button
  if (target.classList.contains('cart_overlay_item_remove_btn')) {
    itemName = target.parentElement.dataset.title;
    removeCartItem(itemName);
  }
});


  function updateCartOverlay() {
    const totalText = document.querySelector('.cart_overlay_checkout_total_text')
    const cartItemsCont = document.querySelector('.cart_overlay_items');
    const cartOverlayTotalText = document.querySelector('.cart_overlay_checkout_total_text');      
    populateCartOverlay(cart,cartItemsCont,cartOverlayTotalText)
    saveCartToLocalStorage()
    
    
  }


  function incrementCartItem(itemName) {
    const existingItem = cart.find((item) => item.itemTitle === itemName);
    if (existingItem) {
      existingItem.quantity++;
      existingItem.total_price = existingItem.quantity * existingItem.default_price;
      updateCartOverlay();
    }
  }
  
  function decrementCartItem(itemName) {
    const existingItem = cart.find((item) => item.itemTitle === itemName);
    if (existingItem && existingItem.quantity > 1) {
      existingItem.quantity--;
      existingItem.total_price = existingItem.quantity * existingItem.default_price;
      updateCartOverlay();
    }
  }
  
  function removeCartItem(itemName) {
    const existingItemIndex = cart.findIndex((item) => item.itemTitle === itemName);
    if (existingItemIndex !== -1) {
      cart.splice(existingItemIndex, 1);
      updateCartOverlay();
    }
  }
  
}else if (window.location.href.includes("preview.html")) {

  //

  function formatCartAsSentence(cart) {
    var sentence = "Cart Contents: ";
    
    for (var i = 0; i < cart.length; i++) {
      var item = cart[i];
      var totalPriceWithoutSymbol = item.total_price.toString().replace('₦', ''); // Remove ₦ symbol
      var itemTitleWithoutAmpersand = item.itemTitle.replace('&', 'and'); // Replace & with "and"
  
      var drinksSentence = "";
      if (item.drinks.length > 0) {
        var drinkNames = Object.keys(item.drinks[0]);
        var drinkPrice = item.drinks[0][drinkNames[0]];
        drinksSentence = `with ${drinkNames[0]} - ₦${drinkPrice}`;
      }
  
      var swallowsSentence = "";
      if (item.swallows.length > 0) {
        var swallowNames = Object.keys(item.swallows[0]);
        var swallowPrice = item.swallows[0][swallowNames[0]];
        swallowsSentence = `with ${swallowNames[0]} - ₦${swallowPrice}`;
      }
  
      var itemSentence = `${item.quantity}x ${itemTitleWithoutAmpersand} - ₦${totalPriceWithoutSymbol} ${drinksSentence} ${swallowsSentence}`;
      
      // Add a comma and space between items (except for the last one)
      if (i < cart.length - 1) {
        itemSentence += ", ";
      }
  
      sentence += itemSentence;
    }
  
    return sentence;
  }
  
  



  initializeCartFromLocalStorage();
  // Retrieve the form data from local storage
  const savedFormData = JSON.parse(localStorage.getItem('userDetails'));
  // Display the saved data on the page
  document.getElementById('previewName').textContent = savedFormData.name;
  document.getElementById('previewPhoneNumber').textContent = savedFormData.phoneNumber;
  document.getElementById('previewEmailAddress').textContent = savedFormData.emailAddress;
  document.getElementById('previewLocation').textContent = savedFormData.location;

  const cartItemsCont = document.querySelector('.cart_preview_details');
  const cartOverlayTotalText = document.querySelector('.total_cont_text');      
  populateCartOverlay(cart,cartItemsCont,cartOverlayTotalText)
    const decrementBtn = document.querySelector('.cart_overlay_decrement_quantity')
    const incrementBtn = document.querySelector('.cart_overlay_increment_quantity')
    const removebtn = document.querySelector('.cart_overlay_item_remove_btn')



   
    const whatsapp = `${savedFormData.name},${savedFormData.location},${savedFormData.emailAddress},${formatCartAsSentence(cart)},total: ₦${calculateTotal(cart)}`
            
  const confirmOrder = document.querySelector('.confirm_order')
  confirmOrder.addEventListener('click', () => {
    // Redirect the user to the specified link


    window.location.href =`https://wa.me/2348034023196?text=${whatsapp}%20`;
  })
}

   

})})


function clearCart() {
  cart = []
  saveCartToLocalStorage()
}
function clickOnItem(item) {
   /* overlay variables */
   document.body.style.overflow = 'hidden';
   const modalContainer = document.querySelector('.modal-overlay')
   const cartOverlay = document.querySelector('.open_cart_overlay')
   const closeMenuOverlayBtn = modalContainer.querySelector('.close_menu_overlay_btn')
   const selectProductClickedBtn = modalContainer.querySelector('.menu_overlay_submit')
   const overlayMenuName = modalContainer.querySelector('.order_title')
   const overlayMenuPrice = modalContainer.querySelector('.menu_product_price_text')
   const totalOverlayMenuPrice = modalContainer.querySelector('.overlay_total_price_text')
   const decrementBtn = modalContainer.querySelector('.decrement_overlay_item')
   const incrementBtn = modalContainer.querySelector('.increment_overlay_item')
   const quantity = modalContainer.querySelector('.menu_overlay_quantity')
   const swallowCheckbox = modalContainer.querySelector('.swallow_overlay_checkbox')
   const drinkCheckbox = document.querySelector('.menu_product_drink')

/* clicked item variables */
let itemPrice = item.querySelector('.item_price_text').innerText
const itemName = item.querySelector('.item_name_text').innerText

itemPrice = parseFloat(itemPrice.replace(/,/g, ''));


 const parentEl = item.parentElement.id

/* RESET */
function returnToDefault() {
  quantity.innerHTML = 1 ;
  modalContainer.classList.remove('open-modal');
  document.body.style.overflow = 'auto';
  swallowCheckbox.innerHTML = ' ';
  swallowCheckbox.innerHTML = ' ';
  totalOverlayMenuPrice.innerHTML = 0;
  overlayMenuPrice.innerHTML = 0;
  drinkCheckbox.style.display = 'flex'
  swallowCheckbox.classList.remove('border_bottom_menu');
}

 function updateOrangespanOrder(clickedItem) {
  const orangeSpan = item.querySelector('.orange-bg')
  orangeSpan.classList.remove('dont_show')
  orangeSpan.innerText = clickedItem
}


///////////////////////////////////////////////////////////////
                    /* ADDITION */
///////////////////////////////////////////////////////////////

const existingItem = cart.find(item => item.itemTitle === itemName);

if (existingItem) {
  // If it exists, update quantity and total_price
  incrementClickedItem(existingItem)
  updateOrangespanOrder(existingItem.quantity)
  showCartBottomOverlay(cart)
  returnToDefault() 
  saveCartToLocalStorage();
    }else{
      ///////////////////////////////////////////////////////////////
                          /* OVERLAY */
      ///////////////////////////////////////////////////////////////
        /* updating the dom during load */
        overlayMenuName.textContent = itemName
        overlayMenuPrice.innerText = itemPrice 
        totalOverlayMenuPrice.innerText = itemPrice.toLocaleString() 
        modalContainer.classList.add('open-modal')
      console.log(totalOverlayMenuPrice);
        if (parentEl == 'SOUP') {
          const swallowOptionHtml = `
            <div class="menu_product_drink border_bottom_menu swallow_menu_options">
              <div class="menu_overlay_title">
                swallow
              </div>
              <div class="menu_product_drink_checkbox menu_product_swallow_checkbox">
                ${
                  SWALLOW_OPTION.map((item) => {
                    for (const swallow in item) {
                      return `
                        <label class="menu_product_swallow_checkbox_container label" >
                          <p>${swallow}</p>
                          <input  type="checkbox" data-price="${item[swallow]}" >
                          <span class="menu_product_swallow_checkbox_checkmark"></span>
                        </label>`;
                    }
                  }).join('') 
                }
              </div>
            </div>
          `;
          swallowCheckbox.classList.remove('border_bottom_menu')
          swallowCheckbox.innerHTML = swallowOptionHtml;
        }

        if (parentEl == 'DRINKS') {
          drinkCheckbox.style.display = 'none'
        }

        const swallowCheckboxes = document.querySelectorAll('.menu_product_swallow_checkbox_container input[type="checkbox"]');
        swallowCheckboxes.forEach((checkbox) => {
          checkbox.addEventListener('change', updateTotalPrice);
        });

        const drinkCheckboxes = document.querySelectorAll('.menu_product_drinks_checkbox_container  input[type="checkbox"]');
        drinkCheckboxes.forEach((checkbox) => {
          checkbox.addEventListener('change', updateTotalPrice);
        });





      /* Quantity updating */
      decrementBtn.addEventListener('click', () => {
        let currentQuantity = parseInt(quantity.innerText, 10);
        
        if (currentQuantity > 1) {
          currentQuantity--;
          quantity.innerText = currentQuantity;
        } else {
          quantity.innerText = '1'; // Minimum quantity should be 1
        }

        updateTotalPrice();
      });

      incrementBtn.addEventListener('click', () => {
        let currentQuantity = parseInt(quantity.innerText, 10);
        currentQuantity++;
        quantity.innerText = currentQuantity;

        updateTotalPrice();
      });


      function createItemQuantitySpan(titleText) {
        const titleDiv = document.createElement('span');
        titleDiv.href = `#${titleText}`;
        titleDiv.classList.add('orange-bg');
        titleDiv.textContent = titleText;
        
        return titleDiv;
      }




      function updateTotalPrice() {
        let totalPrice = 0;
        const currentQuantity = parseInt(quantity.innerText, 10);
        let total = itemPrice * currentQuantity;
        const checkboxes = document.querySelectorAll('.menu_product_swallow_checkbox_container input[type="checkbox"]:checked, .menu_product_drinks_checkbox_container input[type="checkbox"]:checked');
        
        checkboxes.forEach((checkbox) => {
          const price = parseFloat(checkbox.dataset.price);
          
          if (!isNaN(price)) {
            total += price;
          }
          
        });
       
        
        totalOverlayMenuPrice.textContent =  total.toLocaleString()
   

      }

      /* OVERLAY ENDS */

      function addToCart(item) {
        // Collect data from the HTML elements
        const itemTitle = document.querySelector('.order_title').textContent;
        const quantity = parseInt(document.querySelector('.menu_overlay_quantity').textContent);
        let total_price = document.querySelector('.overlay_total_price_text').textContent
        const specialInstructionsElement = document.querySelector('.special-instructions-input');
        const specialInstructions = specialInstructionsElement ? specialInstructionsElement.value : null;
        const categoryName = item.dataset.menu
         total_price = parseInt(total_price.replace(/,/g, ''), 10);
        console.log(total_price);
        // Check if an item with the same title already exists in the cart
        const existingItemIndex = cart.findIndex((cartItem) => cartItem.itemTitle === itemTitle);

        if (existingItemIndex !== -1) {
          // If it exists, update the existing item
          const existingItem = cart[existingItemIndex];
          existingItem.quantity += quantity;
          existingItem.total_price = existingItem.quantity * existingItem.default_price;
          
        } else {
          // If it doesn't exist, create a new cart item
          let selectedDrinks = [];
          const drinkCheckboxes = document.querySelectorAll('.menu_product_drinks_checkbox_container input[type="checkbox"]:checked');
          if (drinkCheckboxes.length > 0) {
            drinkCheckboxes.forEach((checkbox) => {
              selectedDrinks.push({
                [checkbox.previousElementSibling.textContent]: checkbox.dataset.price,
              });
            });
          }

          let selectedSwallows = [];
          const swallowCheckboxes = document.querySelectorAll('.menu_product_swallow_checkbox_container input[type="checkbox"]:checked');
          if (swallowCheckboxes.length > 0) {
            swallowCheckboxes.forEach((checkbox) => {
              selectedSwallows.push({
                [checkbox.previousElementSibling.textContent]: checkbox.dataset.price,
              });
            });
          }
        
          createCartItem(
            itemTitle,
            quantity,
            selectedDrinks,
            selectedSwallows,
            specialInstructions,
            categoryName,
            total_price,
            total_price

          );
        }
        updateOrangespanOrder(quantity);
        returnToDefault();
      }


      function createCartItem(itemTitle, quantity, drinks, swallows, specialInstructions,categoryName, default_price, total_price) {
        const newItem = {
          itemTitle,
          quantity,
          drinks,
          swallows,
          specialInstructions,
          categoryName,
          default_price,
          total_price,
        };

        cart.push(newItem);
        
      }

      function updateCartTotal() {
        // Code to calculate and display the cart total.
      }

      function removeFromCart(itemIndex) {
        cart.splice(itemIndex, 1);
        // Code to update the UI to reflect the removal (you'll implement this later)
      }






      modalContainer.addEventListener('click', (e)=>{
       if(e.target.className ==='modal-overlay open-modal'){
         returnToDefault();
       }
      })
      closeMenuOverlayBtn.addEventListener('click', () => {
        returnToDefault();
      });
  
      selectProductClickedBtn.addEventListener('click', () => {
        addToCart(item);
        location.reload()
        saveCartToLocalStorage();
        showCartBottomOverlay(cart)
        
      });
      


    }

    const cartItemsCont = document.querySelector('.cart_overlay_items');
    const cartOverlayTotalText = document.querySelector('.cart_overlay_checkout_total_text');      
    populateCartOverlay(cart,cartItemsCont,cartOverlayTotalText)


}


function calculateTotal(param) {
  const totalAmount = param.reduce((total, item) => total + item.total_price, 0);
  var formattedNumber = totalAmount.toLocaleString();
  return formattedNumber
}

const cartOverlay = document.querySelector('.cart_overlay')


if (window.location.href.includes("menu.html")) {
const cartOverlayBottom = document.querySelector('.cart_overlay_bottom')
function showCartBottomOverlay(par){
  const cartOverlayBottomQuantity = document.querySelector('.cart_overlay_bottom_total_quantity')
  const cartOverlayBottomAmount = document.querySelector('.cart_overlay_bottom_total_amount')
  const jsonLength = par.length;
cartOverlayBottomQuantity.innerText = jsonLength
cartOverlayBottomAmount.innerText = calculateTotal(par)
if (jsonLength > 0) {
  cartOverlayBottom.classList.add('open_cart_overlay_bottom');
}
  
}

cartOverlayBottom.addEventListener('click', cartOverlayFunc)


const closeBtn = document.querySelector('.close-btn')

closeBtn.addEventListener('click', () => {
  location.reload();
  document.body.style.overflow = 'auto';
  cartOverlay.classList.remove('open-modal')
  })

}


function cartOverlayFunc() {
  document.body.style.overflow = 'hidden';
  cartOverlay.classList.add('open-modal')  
}






function populateCartOverlay(cartData,cartItemsCont,total) {
  

  function populateSwallows(swallows) {
    if (swallows && swallows.length > 0) {
      return swallows.map(s => Object.keys(s)[0]).join(', ');
    } else {
      return '';
    }
  }

  function createCartItemsInOverlay(data) {
    var formattedNumber = data.total_price.toLocaleString();
    const overlayLabel = `
    <div class="cart_overlay_item" data-title="${data.itemTitle}">
      <div class="cart_overlay_item_product_cont cart_overlay_item_product_cont_items">
        <p class="cart_overlay_item_product_name">${data.itemTitle}, ${populateSwallows(data.swallows)}</p>

        <p class="cart_overlay_item_product_drinks">${populateSwallows(data.drinks)}</p>
      </div>
      <div class="cart_overlay_item_remove_btn">remove</div>
      <div class="cart_overlay_item_product_cont">
        <p class="cart_overlay_item_product_price">
          <span>₦</span>
          <span class="cart_overlay_item_product_price_text">${formattedNumber}</span>
        </p>
        <div class="cart_overlay_item_product_quantity_cont">
          <div class=" cart_overlay_decrement_quantity">
            <svg class="Layer_1" version="1.1" viewBox="0 0 15 15" xml:space="preserve">
              <path d="M7.5,0C3.364,0,0,3.364,0,7.5S3.364,15,7.5,15S15,11.636,15,7.5S11.636,0,7.5,0z M7.5,14C3.916,14,1,11.084,1,7.5  S3.916,1,7.5,1S14,3.916,14,7.5S11.084,14,7.5,14z"/>
              <rect height="1" width="8" x="3.5" y="7"/>
            </svg>
          </div>
          <p class="cart_overlay_item_product_quantity_cont">${data.quantity}</p>
          <div class="cart_overlay_increment_quantity">
            <svg viewBox="0 0 32 32" class="Layer_1 Layer_2">
              <path d="M16,29A13,13,0,1,1,29,16,13,13,0,0,1,16,29ZM16,5A11,11,0,1,0,27,16,11,11,0,0,0,16,5Z"/>
              <path d="M16,23a1,1,0,0,1-1-1V10a1,1,0,0,1,2,0V22A1,1,0,0,1,16,23Z"/>
              <path d="M22,17H10a1,1,0,0,1,0-2H22a1,1,0,0,1,0,2Z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
    `;
    return overlayLabel;
  }

  cartItemsCont.innerHTML = cartData.map(data => createCartItemsInOverlay(data)).join('')
 total.innerText = calculateTotal(cartData);
  
}






