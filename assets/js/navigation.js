// Navigation data - can be updated dynamically
const navigationData = [
    { name: 'Home', link: '/index.html' },
    { name: 'About', link: '/pages/about/index.html' },
    { name: 'Data Visualisation', link: '/pages/data-visualisation/index.html' },
    { name: 'Design', link: '/pages/design/index.html' },
    { name: 'More Information', link: '/pages/more-information/index.html' }
  ];
  
  // Function to create the navigation bar
  function createNavbar() {
    const navbar = document.createElement('nav');
    navbar.classList.add('navbar');
  
    // Logo (Home link)
    const logo = document.createElement('div');
    logo.classList.add('navbar-logo');
    const logoLink = document.createElement('a');
    logoLink.href = '/index.html';
    logoLink.textContent = 'Logo';
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
      linkItem.textContent = item.name;
      listItem.appendChild(linkItem);
      navList.appendChild(listItem);
    });
  
    navLinks.appendChild(navList);
    navbar.appendChild(navLinks);
  
    // Mobile Toggle Button
    const toggleButton = document.createElement('div');
    toggleButton.classList.add('navbar-toggle');
    const toggleIcon = document.createElement('span');
    toggleIcon.classList.add('toggle-icon');
    toggleIcon.innerHTML = '&#9776;';  // Hamburger icon
    toggleButton.appendChild(toggleIcon);
    navbar.appendChild(toggleButton);
  
    // Append the navbar to the body or a specific container
    document.body.prepend(navbar);
  
    // Toggle menu functionality for mobile view
    toggleButton.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }
  
  // Inject the navigation on page load
  document.addEventListener("DOMContentLoaded", function () {
    createNavbar();
  });
  