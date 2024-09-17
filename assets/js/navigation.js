// Navigation data - dynamically populate
const navigationData = [
  { name: 'Home', link: './index.html', icon: 'fa-home' },
  { name: 'About', link: './pages/about/index.html', icon: 'fa-info-circle' },
  { name: 'Data Visualisation', link: './pages/data-visualisation/index.html', icon: 'fa-chart-bar' },
  { name: 'Design', link: './pages/design/index.html', icon: 'fa-palette' },
  { name: 'More Info', link: './pages/more-information/index.html', icon: 'fa-info' }
];


// Function to create the navigation bar dynamically
function createNavbar() {
  console.log("Navbar is being created...");

  const navbar = document.createElement('nav');
  navbar.classList.add('navbar');

  // Logo with a modern font style
  const logo = document.createElement('div');
  logo.classList.add('navbar-logo');
  const logoLink = document.createElement('a');
  logoLink.href = '/index.html';
  logoLink.textContent = 'Logo';  // Modern logo text
  logo.appendChild(logoLink);
  navbar.appendChild(logo);

  // Navigation links container
  const navLinks = document.createElement('div');
  navLinks.classList.add('navbar-links');
  const navList = document.createElement('ul');

  // Loop through the navigationData to create links dynamically
  navigationData.forEach(item => {
    const listItem = document.createElement('li');
    const linkItem = document.createElement('a');
    linkItem.href = item.link;
    linkItem.innerHTML = `<i class="fas ${item.icon}"></i> ${item.name}`;  // Add icon here
    listItem.appendChild(linkItem);
    navList.appendChild(listItem);
  });

  navLinks.appendChild(navList);
  navbar.appendChild(navLinks);

  // Mobile Toggle Button (Hamburger)
  const toggleButton = document.createElement('div');
  toggleButton.classList.add('navbar-toggle');
  const toggleIcon = document.createElement('span');
  toggleIcon.classList.add('toggle-icon');
  toggleIcon.innerHTML = '&#9776;';  // Hamburger icon
  toggleButton.appendChild(toggleIcon);
  navbar.appendChild(toggleButton);

  // Append the navbar to the body
  document.body.prepend(navbar);

  // Toggle menu functionality for mobile view
  toggleButton.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
}

// Inject the navigation on page load
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded and parsed.");
  createNavbar();
});

// Sticky navbar effect
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});
