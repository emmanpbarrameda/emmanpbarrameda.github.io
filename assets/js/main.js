const name1 = "Freelancer";
const name2 = "Student";
const name3 = "Desktop Developer";

let i = 0;
let currentName = name1;

function typeEffect() {
  const homeWorkElement = document.getElementsByClassName("home__work")[0];

  if (i <= currentName.length) {
    const typedText = currentName.substring(0, i);
    homeWorkElement.innerHTML = typedText + "█";
    i++;
    setTimeout(typeEffect, 100);
  } else {
    setTimeout(function () {
      i = 0;
      if (currentName === name1) {
        currentName = name2;
      } else if (currentName === name2) {
        currentName = name3;
      } else {
        currentName = name1;
      }
      homeWorkElement.innerHTML = "";
      typeEffect();
    }, 2000);
  }
}

function work() {
  setTimeout(typeEffect, 1000);
}

work();





/*==================== MENU SHOW Y HIDDEN ====================*/
const navMenu = document.getElementById("nav-menu"),
  navToggle = document.getElementById("nav-toggle"),
  navClose = document.getElementById("nav-close");

/*===== MENU SHOW =====*/
/* Validate if constant exists */
if (navToggle) {
  navToggle.addEventListener("click", () => {
    // Add show-menu class
    navMenu.classList.add("show-menu");

    // Add animation class
    navMenu.classList.add("animate__animated", "animate__fadeIn");

    // Remove animation class after a delay
    setTimeout(() => {
      navMenu.classList.remove("animate__animated", "animate__fadeIn");
    }, 1000); // Adjust the delay as needed
  });
}


/*===== MENU HIDDEN =====*/
/* Validate if constant exists */
if (navClose) {
  navClose.addEventListener("click", () => {
    navMenu.classList.remove("show-menu");
  });
}

/*==================== REMOVE MENU MOBILE ====================*/
const navLink = document.querySelectorAll(".nav__link");

function linkAction() {
  // When we click on each nav__link, we remove the show-menu class
  navMenu.classList.remove("show-menu");
}
navLink.forEach((n) => n.addEventListener("click", linkAction));



/*==================== QUALIFICATION TABS ====================*/
/*
const tabs = document.querySelectorAll("[data-target]"),
  tabContents = document.querySelectorAll("[data-content]");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = document.querySelector(tab.dataset.target);

    tabContents.forEach((tabContent) => {
      tabContent.classList.remove("qualification__active");
    });
    target.classList.add("qualification__active");

    tabs.forEach((tab) => {
      tab.classList.remove("qualification__active");
    });
    tab.classList.add("qualification__active");
  });
});
*/


/*==================== CONTACT TABS ====================*/

document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll("[data-target]");
  const tabContents = document.querySelectorAll("[data-content]");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = document.querySelector(tab.dataset.target);

      tabContents.forEach((tabContent) => {
        tabContent.style.display = "none";
      });
      target.style.display = "block";

      tabs.forEach((tab) => {
        tab.classList.remove("contactinfo__active");
      });
      tab.classList.add("contactinfo__active");
    });
  });
});


/*==================== DISABLE SAVING OF THIS IMAGES ====================*/

document.addEventListener('contextmenu', function (event) {
  var targetElement = event.target;
  if (targetElement.tagName === 'IMG' && targetElement.classList.contains('about__img')) {
    event.preventDefault();
  }
});



/*==================== SERVICES MODAL ====================*/

// Select all the modal views, modal buttons, and modal close buttons
const modalViews = document.querySelectorAll(".services__modal"),
  modalBtns = document.querySelectorAll(".services__button"),
  modalCloses = document.querySelectorAll(".services__modal-close");

// Function to open a modal view
let modal = function (modalClick) {
  modalViews[modalClick].classList.add("active-modal");
  document.body.classList.add("disable-scroll");
};

// Attach click event listeners to the modal buttons
modalBtns.forEach((modalBtn, i) => {
  modalBtn.addEventListener("click", () => {
    modal(i); // Open the corresponding modal view
  });
});

// Attach click event listeners to the modal close buttons
modalCloses.forEach((modalClose) => {
  modalClose.addEventListener("click", () => {
    closeModal(); // Close the modal view
  });
});

// Function to close the modal view
function closeModal() {
  modalViews.forEach((modalView) => {
    modalView.classList.remove("active-modal");
    document.body.classList.remove("disable-scroll");
  });
}

// Add a keydown event listener to the document
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal(); // Close the modal view when the ESC key is pressed
  }
});

// Store the initial URL hash
const initialHash = window.location.hash;

// Add a popstate event listener to the window
window.addEventListener("popstate", () => {
  const currentHash = window.location.hash;
  
  // Check if the hash has changed from the initial value
  if (currentHash !== initialHash) {
    closeModal(); // Close the modal view when the back button is pressed on mobile
  }
});



/*==================== PROJECTS SWIPER ====================*/

var swiper = new Swiper(".projects__container", {
  direction: 'horizontal',
  cssMode: true,
  loop: true,
  mousewheel: true,
  keyboard: true,

  // If we need pagination
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },


  // Navigation arrows
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },

});

/*
GET SWIPER
https://unpkg.com/browse/swiper@9.3.2/
https://swiperjs.com/get-started
*/





/*==================== CONTACT AVAILABILITY ====================*/

// Get the element(s) with the class
let elements = document.getElementsByClassName("contact-availability__subtitle");
let icons = document.getElementsByClassName("contact-availability__icon");

//get the icon
for (let i = 0; i < elements.length; i++) {

  // Check if the text content contains the exact word "Available"
  if (elements[i].textContent.trim() === "Available") {
    icons[i].classList.add("uil-check"); // Replace with the desired Unicons line icon class for "Available"
    icons[i].classList.add("active"); //set color
    icons[i].classList.remove("inactive"); // Remove the "inactive" class
    icons[i].classList.remove("busy"); // Remove the "busy" class

    // Check if the text content contains the exact phrase "Not Available"
  } else if (elements[i].textContent.trim() === "Not Available") {
    icons[i].classList.add("uil-times"); // Replace with the desired Unicons line icon class for "Not Available"
    icons[i].classList.add("inactive"); //set color
    icons[i].classList.remove("active");
    icons[i].classList.remove("busy");

    // Check if the text content contains the exact phrase "Busy"
  } else if (elements[i].textContent.trim() === "Busy") {
    icons[i].classList.add("uil-pen"); // Replace with the desired Unicons line icon class for "Not Available"
    icons[i].classList.add("busy"); //set color
    icons[i].classList.remove("active");
    icons[i].classList.remove("inactive");
  }

}



/*==================== COPYRIGHT YEAR ====================*/
//update copyright year automatically

// Get the HTML element
let copyrightyear = document.querySelector(".footer__copy year");

// Get the current year
let currentDate = new Date();
let currentYear = currentDate.getFullYear();

// Check if the element exists
if (copyrightyear) {
  console.log(currentYear);
  copyrightyear.textContent = currentYear; // Replace "year" automatically

} else {
  console.log("The <year></year> element was not found.");
}




/*==================== ANIMATION ====================*/
//https://animate.style/

/*================ CONTACT DETAILS ANIMATION ================*/
function animateContactInfo() {
  const contactinfo__elements = document.querySelectorAll('.contactinfo__content');
  contactinfo__elements.forEach((element) => {
    element.classList.add('animate__animated', 'animate__fadeIn', 'animate__faster');
  });
}

const contactinfo__buttons = document.querySelectorAll('.contactinfo__button');
contactinfo__buttons.forEach((button) => {
  button.addEventListener('click', animateContactInfo);
});


/*==================== SWIPER READ MORE BUTTON ANIMATION ====================*/

/*================ NEXT PROJECT ================*/
function animateProjectsNext() {
  const projects__elements_next = document.querySelectorAll('.projects__data');
  projects__elements_next.forEach((element) => {
    element.classList.add('animate__animated', 'animate__fadeInRight');
  });
}

const projects__buttons_next = document.querySelectorAll('.swiper-button-next');
projects__buttons_next.forEach((button) => {
  button.addEventListener('click', animateProjectsNext);
});

/*================ PREV PROJECT ================*/
function animateProjectsPrevious() {
  const projects__elements_previous = document.querySelectorAll('.projects__data');
  projects__elements_previous.forEach((element) => {
    element.classList.add('animate__animated', 'animate__fadeInLeft');
  });
}

const projects__buttons_previous = document.querySelectorAll('.swiper-button-prev');
projects__buttons_previous.forEach((button) => {
  button.addEventListener('click', animateProjectsPrevious);
});










/*==================== SCROLL SECTIONS ACTIVE LINK ====================*/

const sections = document.querySelectorAll("section[id]");

function scrollActive() {
  const scrollY = window.pageYOffset;

  sections.forEach((current) => {
    const sectionHeight = current.offsetHeight;
    const sectionTop = current.offsetTop - 50;
    sectionId = current.getAttribute("id");

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      document
        .querySelector(".nav__menu a[href*=" + sectionId + "]")
        .classList.add("active-link");
    } else {
      document
        .querySelector(".nav__menu a[href*=" + sectionId + "]")
        .classList.remove("active-link");
    }
  });
}
window.addEventListener("scroll", scrollActive);



/*==================== CHANGE BACKGROUND HEADER ====================*/
function scrollHeader() {
  const nav = document.getElementById("header");
  // When the scroll is greater than 80 viewport height, add the scroll-header class to the header tag
  if (this.scrollY >= 80) nav.classList.add("scroll-header");
  else nav.classList.remove("scroll-header");
}
window.addEventListener("scroll", scrollHeader);



/*==================== SHOW SCROLL UP ====================*/
function scrollUp() {
  const scrollUp = document.getElementById("scroll-up");
  // When the scroll is higher than 560 viewport height, add the show-scroll class to the a tag with the scroll-top class
  if (this.scrollY >= 560) scrollUp.classList.add("show-scroll");
  else scrollUp.classList.remove("show-scroll");
}
window.addEventListener("scroll", scrollUp);

// Add animation to scroll-up button
const scrollUpButton = document.getElementById("scroll-up");

scrollUpButton.addEventListener("click", () => {
  // Add animate__fadeInUp class
  scrollUpButton.classList.add("animate__animated", "animate__slideInUp");

  // Remove animate__fadeInUp class after the animation finishes
  setTimeout(() => {
    scrollUpButton.classList.remove("animate__animated", "animate__slideInUp");
  }, 1000); // Adjust the delay as needed
});


/*==================== SHOW SCROLL DOWN ====================*/
function scrollDown() {
  const scrollDown = document.getElementById("scroll-down");
  // When the scroll is higher than 560 viewport height, add the show-scrolldown class to the a tag with the scroll-top class
  if (this.scrollY <500) scrollDown.classList.add("show-scrolldown");
  else scrollDown.classList.remove("show-scrolldown");
}
window.addEventListener("scroll", scrollDown);

// Add animation to scroll-down button
const scrollDownButton = document.getElementById("scroll-down");

scrollDownButton.addEventListener("click", () => {
  // Add animate__fadeInUp class
  scrollDownButton.classList.add("animate__animated", "animate__slideInDown");

  // Remove animate__fadeInUp class after the animation finishes
  setTimeout(() => {
    scrollDownButton.classList.remove("animate__animated", "animate__slideInDown");
  }, 1000); // Adjust the delay as needed
});





/*==================== DARK LIGHT THEME ====================*/

const themeButton = document.getElementById("theme-button");
const darkTheme = "dark-theme";
const iconTheme = "uil-sun";

// Previously selected topic (if user selected)
const selectedTheme = localStorage.getItem("selected-theme");
const selectedIcon = localStorage.getItem("selected-icon");

// We obtain the current theme that the interface has by validating the dark-theme class
const getCurrentTheme = () =>
  document.body.classList.contains(darkTheme) ? "dark" : "light";
const getCurrentIcon = () =>
  themeButton.classList.contains(iconTheme) ? "uil-moon" : "uil-sun";

// Validate if user previously chose a theme
if (selectedTheme) {
  // If theme selected by user previously then we add/remove classes again based on localStorage
  document.body.classList[selectedTheme === "dark" ? "add" : "remove"](
    darkTheme
  );
  themeButton.classList[selectedIcon === "uil-moon" ? "add" : "remove"](
    iconTheme
  );
}
// If initially there is no local storage, i.e., user has not made a choice and this is the first time loading
// Then we check if browser/OS is in dark mode and then add dark theme if required by default
else if (
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches
) {
  console.log("found dark mode for browser/OS");
  // Add dark theme by setting dark theme flags in localStorage
  localStorage.setItem("selected-theme", "dark");
  localStorage.setItem("selected-icon", "uil-moon");
  // Add classes for dark theme in DOM
  document.body.classList.add(darkTheme);
  themeButton.classList.add(iconTheme);
}

// Activate / deactivate the theme manually with the button
themeButton.addEventListener("click", () => {
  // Add or remove the dark / icon theme
  document.body.classList.toggle(darkTheme);
  themeButton.classList.toggle(iconTheme);

  // Add animation classes using Animate.css
  document.body.classList.add("animate__animated", "animate__fadeIn");
  themeButton.classList.add("animate__animated", "animate__fadeIn");

  // Remove animation classes after the animation finishes
  setTimeout(() => {
    document.body.classList.remove("animate__animated", "animate__fadeIn");
    themeButton.classList.remove("animate__animated", "animate__fadeIn");
  }, 500);

  // We save the theme and the current icon that the user chose
  localStorage.setItem("selected-theme", getCurrentTheme());
  localStorage.setItem("selected-icon", getCurrentIcon());
});

