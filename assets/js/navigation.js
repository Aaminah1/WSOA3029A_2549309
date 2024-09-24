// Detect current page depth (how many directories deep)
const currentDepth = (window.location.pathname.match(/\//g) || []).length - 1;

// Function to adjust the link paths dynamically based on current page location
function adjustPath(link) {
  // If we are at the root level (index.html), no need to adjust
  if (currentDepth === 1) {
    return link;
  }

  // Otherwise, adjust the link path based on the current depth
  let adjustedPath = '';
  for (let i = 1; i < currentDepth; i++) {
    adjustedPath += '../';
  }
  return adjustedPath + link;
}

// Navigation data - dynamically populate with relative paths
const navigationData = [
  { name: 'Home', link: 'index.html', icon: 'fa-home' },
  { name: 'About', link: 'pages/about/index.html', icon: 'fa-info-circle' },
  { name: 'Data Visualisation', link: 'pages/data-visualisation/index.html', icon: 'fa-chart-bar' },
  { name: 'Design', link: 'pages/design/index.html', icon: 'fa-palette' },
  { name: 'Gallery', link: 'pages/gallery/index.html', icon: 'fa-info' }
];

// Function to create the navigation bar dynamically
function createNavbar() {
  const navbar = document.createElement('nav');
  navbar.classList.add('navbar');

  // Logo with a modern font style
  const logo = document.createElement('div');
  logo.classList.add('navbar-logo');
  const logoLink = document.createElement('a');
  logoLink.href = adjustPath('index.html');
  logoLink.textContent = 'Logo';  // Modern logo text
  logo.appendChild(logoLink);
  navbar.appendChild(logo);

  // Navigation links container
  const navLinks = document.createElement('div');
  navLinks.classList.add('navbar-links');
  const navList = document.createElement('ul');

  // Loop through the navigationData to create links dynamically with adjusted paths
  navigationData.forEach(item => {
    const listItem = document.createElement('li');
    const linkItem = document.createElement('a');
    linkItem.href = adjustPath(item.link);  // Adjust path dynamically
    linkItem.innerHTML = `<i class="fas ${item.icon}"></i> ${item.name}`;  // Add icon here
    listItem.appendChild(linkItem);
    navList.appendChild(listItem);
  });

  navLinks.appendChild(navList);
  navbar.appendChild(navLinks);

  // Mobile Toggle Button (Hamburger/Close)
  const toggleButton = document.createElement('div');
  toggleButton.classList.add('navbar-toggle');
  const toggleIcon = document.createElement('span');
  toggleIcon.classList.add('toggle-icon');
  toggleIcon.innerHTML = '&#9776;';  // Hamburger icon initially
  toggleButton.appendChild(toggleIcon);
  navbar.appendChild(toggleButton);

  // Append the navbar to the body
  document.body.prepend(navbar);

  // Toggle menu functionality for mobile view
  toggleButton.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    // Toggle between hamburger (open) and close (close) icons
    if (navLinks.classList.contains('active')) {
      toggleIcon.innerHTML = '&times;'; // Show close icon
    } else {
      toggleIcon.innerHTML = '&#9776;'; // Show hamburger icon
    }
  });
}

// Inject the navigation on page load
document.addEventListener("DOMContentLoaded", function () {
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
// Function to create the footer dynamically
function createFooter() {
  const footer = document.createElement('footer');
  footer.classList.add('footer');

  // Footer content
  const footerContent = `
    <div class="footer-content">
      <div class="footer-logo">
        <a href="${adjustPath('index.html')}">Logo</a>
      </div>
      <div class="footer-links">
        <ul>
          <li><a href="${adjustPath('pages/about/index.html')}">About</a></li>
          
        </ul>
      </div>
      <div class="footer-social">
        <a href="https://twitter.com" target="_blank"><i class="fab fa-twitter"></i></a>
        <a href="https://facebook.com" target="_blank"><i class="fab fa-facebook"></i></a>
        <a href="https://instagram.com" target="_blank"><i class="fab fa-instagram"></i></a>
      </div>
      <p class="footer-copyright">&copy; ${new Date().getFullYear()} CoolBrand. All rights reserved.</p>
    </div>
  `;

  // Inject footer content
  footer.innerHTML = footerContent;
  document.body.appendChild(footer);
}

// Inject the footer on page load
document.addEventListener("DOMContentLoaded", function () {
  createFooter();
});
