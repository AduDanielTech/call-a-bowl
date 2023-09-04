// Element.getBoundingClientRect() method returns the size of an element and its position relative to the viewport.
// pageYOffset is a read - only window property that returns the number of pixels the document has been scrolled vertically.
// slice extracts a section of a string without modifying original string
//offsetTop - A Number, representing the top position of the element, in pixels

// ********** set date ************
// select span
/* const date = document.getElementById("date");
date.innerHTML = new Date().getFullYear(); */

// ********** close links ************
const navToggle = document.querySelector(".nav-toggle");
const linksContainer = document.querySelector(".link_container");
const links = document.querySelector(".nav_links");

navToggle.addEventListener("click", function () {
  // linksContainer.classList.toggle("show-links");

  const linksHeight = links.getBoundingClientRect().height;
  console.log(links)
  const containerHeight = linksContainer.getBoundingClientRect().height;
  if (containerHeight === 0) {
    linksContainer.style.height = `270px`;
  } else {
    linksContainer.style.height = 0;
  }
});

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



window.addEventListener('DOMContentLoaded', () => {
  const menuItems = document.querySelectorAll('.menu_title');
menuItems.forEach((menuItem) => {
  menuItem.addEventListener('click', () => {
   
    menuItems.forEach((item) => {
      item.classList.remove('active_title');
    });

   
    menuItem.classList.add('active_title');
  });
});
})
// Add a click event listener to each menu item

           
// ********** smooth scroll ************
// select links
/* const scrollLinks = document.querySelectorAll(".scroll-link");
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
    let position = element.offsetTop - navHeight;

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
}); */
// calculate heights
