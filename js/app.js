// Element.getBoundingClientRect() method returns the size of an element and its position relative to the viewport.
// pageYOffset is a read - only window property that returns the number of pixels the document has been scrolled vertically.
// slice extracts a section of a string without modifying original string
//offsetTop - A Number, representing the top position of the element, in pixels

// ********** set date ************
// select span
/* const date = document.getElementById("date");
date.innerHTML = new Date().getFullYear(); */

const linksContainer = document.querySelector(".link_container");
function toggleLinks() {
  const navToggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav_links");

  navToggle.addEventListener("click", function () {
    const linksHeight = links.getBoundingClientRect().height;
    const containerHeight = linksContainer.getBoundingClientRect().height;
    if (containerHeight === 0) {
      linksContainer.style.height = `240px`;
    } else {
      linksContainer.style.height = 0;
    }
  });
}

function checkScreenWidth() {
  const screenWidth = window.innerWidth || document.documentElement.clientWidth;

  if (screenWidth < 530) {
    toggleLinks();
  } else {
    // Remove the event listener if the screen width is not below 530
    const navToggle = document.querySelector(".nav-toggle");
    navToggle.removeEventListener("click", toggleLinks);
  }
}

// Initial check when the page loads
checkScreenWidth();

// Add an event listener for the window resize event
window.addEventListener("resize", checkScreenWidth);


// ********** fixed navbar ************

const navbar = document.getElementById("nav");
const topLink = document.querySelector(".top-link");

window.addEventListener("scroll", function () {
  const scrollHeight = window.pageYOffset;
  const navHeight = navbar.getBoundingClientRect().height;

  if (scrollHeight > navHeight) {
    navbar.classList.add("fixed-nav");
    
  } else {
    navbar.classList.remove("fixed-nav");
  }

  if (scrollHeight > 500) {
    topLink.classList.add("show-link");
  } else {
    topLink.classList.remove("show-link");
  }
});

topLink.addEventListener('click', () => {
  // Scroll to the top smoothly
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });

  // Remove the "show-link" class after clicking
  topLink.classList.remove("show-link");
});


// ********** back to top  scroll ************
// select links
const scrollLinks = document.querySelectorAll(".scroll-link");
scrollLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    
    // prevent default
    e.preventDefault();
    // navigate to specific spot
    const id = e.currentTarget.getAttribute("href").slice(1);
    const element = document.getElementById(id);
    
    const navHeight = navbar.getBoundingClientRect().height;
    const containerHeight = linksContainer.getBoundingClientRect().height;
    const fixedNav = navbar.classList.contains("fixed-nav");
    let position = element.offsetTop + navHeight;
    if (!fixedNav) {
      position = position - navHeight;

      
    }
    if (navHeight > 82) {
      position = position + containerHeight;
    }

    window.scrollTo({
      left: 0,
      top: position,
    });
    // close
    linksContainer.style.height = 0;
  });
}); 

// calculate heights

function decrementClickedItem(itemClicked) {
  itemClicked.quantity--
  itemClicked.total_price = itemClicked.quantity  * itemClicked.default_price;
}