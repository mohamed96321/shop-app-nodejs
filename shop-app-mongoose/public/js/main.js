// Navbar
const primaryNav = document.
querySelector('.primary-navigation');

const navToggle = document.
querySelector('.mobile-nav-toggle');

navToggle.addEventListener('click', () => {
  const visibility = primaryNav.
  getAttribute('data-visible');

  if (visibility === "false") {
    primaryNav.setAttribute('data-visible'
    , true);
    navToggle.setAttribute('aria-expanded'
    , true);
  } else {
    primaryNav.setAttribute('data-visible'
    , false);
    navToggle.setAttribute('aria-expanded'
    , false);
  }
});

// Dark mode
let darkMode = localStorage.getItem('darkMode');

const darkModeToggle = document.querySelector('#dark-mode-toggle');
const iconThemeDark = document.getElementById('dark_mode');
const iconThemeLight = document.getElementById('light_mode');

const enableDarkMode = () => {
  document.body.classList.add("darkmode");
  localStorage.setItem("darkMode", "enabled");
};

const disableDarkMode = () => {
  document.body.classList.remove("darkmode");
  localStorage.setItem("darkMode", null);
};

if (darkMode === "enabled") {
  enableDarkMode();
  iconThemeDark.style.display = "none";
  iconThemeLight.style.display = "block";
}

darkModeToggle.addEventListener('click', () => {
  darkMode = localStorage.getItem("darkMode");
  if (darkMode !== "enabled") {
    enableDarkMode();
    iconThemeDark.style.display = "none";
    iconThemeLight.style.display = "block";
  } else {
    disableDarkMode();
    iconThemeDark.style.display = "block";
    iconThemeLight.style.display = "none";
  }
});

