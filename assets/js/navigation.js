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
  { name: 'About', link: 'pages/about/index.html', icon: 'fa-globe' },
  { name: 'Discoveries', link: 'pages/data-visualisation/index.html', icon: 'fa-rocket' },
  { name: 'Design', link: 'pages/design/index.html', icon: 'fa-palette' },
  { name: 'Gallery', link: 'pages/gallery/index.html', icon: 'fa-image' }
  
];


// Function to create the navigation bar dynamically
function createNavbar() {
  const navbar = document.createElement('nav');
  navbar.classList.add('navbar');

  // Create logo container with a modern font style
  const logo = document.createElement('div');
  logo.classList.add('navbar-logo');
  
  // Create the anchor element for the logo with icon
  const logoLink = document.createElement('a');
  logoLink.href = adjustPath('index.html');  // Adjust path dynamically
  
  // Add FontAwesome icon and brand name to the innerHTML of the anchor
  logoLink.innerHTML = 'Life Beyond';  // Using FontAwesome icon
  
  // Add logo-link class for styling
  logoLink.classList.add('logo-link');
  
  // Append the logo link to the logo container
  logo.appendChild(logoLink);
  navbar.appendChild(logo);

  // Navigation links container
  const navLinks = document.createElement('div');
  navLinks.classList.add('navbar-links');
  const navList = document.createElement('ul');

  // Get current page URL for active state detection
  const currentPage = window.location.pathname;

  // Normalize the current page path for comparison
  const normalizedCurrentPage = currentPage.endsWith('/') ? `${currentPage}index.html` : currentPage;

  // Loop through the navigationData to create links dynamically with adjusted paths
  navigationData.forEach(item => {
    const listItem = document.createElement('li');
    const linkItem = document.createElement('a');
    const adjustedLink = adjustPath(item.link);  // Adjust path dynamically
    linkItem.href = adjustedLink;
    linkItem.innerHTML = `<i class="fas ${item.icon}"></i> ${item.name}`;  // Add icon here

    // Compare absolute paths of current page and the link
    const linkPath = new URL(linkItem.href, window.location.origin).pathname;

    if (normalizedCurrentPage === linkPath) {
      listItem.classList.add('active');  // Add active class to the current page
    }

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
    navbar.classList.add('scrolled');  // Add a class when scrolled
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Function to create the footer dynamically
function createFooter() {
  const footer = document.createElement('footer');
  footer.classList.add('footer');

  // Create footer content container
  const footerContent = document.createElement('div');
  footerContent.classList.add('footer-content');

  // Create logo container with the same modern font style
  const footerLogo = document.createElement('div');
  footerLogo.classList.add('footer-logo');
  
  // Create the anchor element for the footer logo with the icon
  const footerLogoLink = document.createElement('a');
  footerLogoLink.href = adjustPath('index.html');  // Adjust path for footer logo
  
  // Add FontAwesome icon and brand name to the innerHTML of the anchor
  footerLogoLink.innerHTML = ' Life Beyond';  // Using FontAwesome icon
  
  // Add same class for consistent styling with the navbar
  footerLogoLink.classList.add('logo-link');
  
  // Append the logo link to the footer logo container
  footerLogo.appendChild(footerLogoLink);
  footerContent.appendChild(footerLogo);

  // Social icons (same as before)
  const footerSocial = document.createElement('div');
  footerSocial.classList.add('footer-social');
  footerSocial.innerHTML = `
    <a href="https://twitter.com" target="_blank"><i class="fab fa-twitter"></i></a>
    <a href="https://facebook.com" target="_blank"><i class="fab fa-facebook"></i></a>
    <a href="https://instagram.com" target="_blank"><i class="fab fa-instagram"></i></a>
  `;
  
  // Append social icons and logo to footer content
  footerContent.appendChild(footerSocial);

  // Copyright text
  const copyright = document.createElement('p');
  copyright.classList.add('footer-copyright');
  copyright.innerHTML = `&copy; ${new Date().getFullYear()} Life Beyond. All rights reserved.`;

  // Append all footer elements to the footer
  footer.appendChild(footerContent);
  footer.appendChild(copyright);
  
  // Append the footer to the body
  document.body.appendChild(footer);
}

// Inject the footer on page load
document.addEventListener("DOMContentLoaded", function () {
  createFooter();
});

//scrolling
window.addEventListener('scroll', function() {
  const overviewItems = document.querySelectorAll('.overview-item');
  const screenPosition = window.innerHeight / 1.3;

  overviewItems.forEach(item => {
      const itemPosition = item.getBoundingClientRect().top;
      if (itemPosition < screenPosition) {
          item.classList.add('visible');
      }
  });
});

//back to top button 
// Get the button
const backToTopBtn = document.getElementById("back-to-top");

// When the user scrolls down 100px from the top, show the button
window.onscroll = function() {
    scrollFunction();
};

function scrollFunction() {
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        backToTopBtn.classList.add("show");
    } else {
        backToTopBtn.classList.remove("show");
    }
}

// When the user clicks on the button, scroll to the top of the page
backToTopBtn.addEventListener("click", function() {
    window.scrollTo({
        top: 0,
        behavior: "smooth" // Smooth scroll effect
    });
});

//breadcrumbs navigation 
document.addEventListener('DOMContentLoaded', function() {
  // Blog titles mapping based on URL or identifier
  const blogPages = {
      'blog1.html': 'Critical Analysis Essay',
      'blog2.html': 'Predesign decision',
      'blog3.html': 'Getting started',
      'blog4.html': 'Design decisions',
      'blog5.html': 'Reflection',
      // Add more blog pages and their titles as needed
  };

  // Get the current URL to extract the page name
  const currentUrl = window.location.pathname;
  const pageName = currentUrl.substring(currentUrl.lastIndexOf('/') + 1);

  // Get the blog title from the mapping
  const blogTitle = blogPages[pageName] || 'Unknown Blog';

  // Generate breadcrumb HTML
  const breadcrumbHtml = `
      <ul>
          <li><a href="/WSOA3029A_2549309/pages/design/index.html">Design</a></li>
<li><a href="/WSOA3029A_2549309/pages/design/index.html?tab=Theory">Theory</a></li>
          <li>${blogTitle}</li>
      </ul>
  `;

  // Insert the breadcrumb into the breadcrumb container
  document.getElementById('breadcrumb').innerHTML = breadcrumbHtml;
});

//next and previous page for blogs
const blogPosts = [
  { title: "Critical Analysis Essay", url: "/WSOA3029A_2549309/pages/design/theory/blog1.html" },
  { title: "Predesign decision", url: "/WSOA3029A_2549309/pages/design/theory/blog2.html" },
  { title: "Getting started", url: "/WSOA3029A_2549309/pages/design/theory/blog3.html" },
  { title: "Design decisions", url: "/WSOA3029A_2549309/pages/design/theory/blog4.html" },
  { title: "Reflection", url: "/WSOA3029A_2549309/pages/design/theory/blog5.html" }
];

const currentPath = window.location.pathname;
let currentIndex = blogPosts.findIndex(post => post.url === currentPath);

function generateNavButtons() {
  const navContainer = document.getElementById('blog-nav');

  if (currentIndex > 0) {
      // Create Previous button
      const prevButton = document.createElement('a');
      prevButton.href = blogPosts[currentIndex - 1].url;
      prevButton.textContent = `←  ${blogPosts[currentIndex - 1].title}`;
      prevButton.classList.add('nav-button', 'prev-button');
      navContainer.appendChild(prevButton);
  }

  if (currentIndex < blogPosts.length - 1) {
      // Create Next button
      const nextButton = document.createElement('a');
      nextButton.href = blogPosts[currentIndex + 1].url;
      nextButton.textContent = ` ${blogPosts[currentIndex + 1].title} →`;
      nextButton.classList.add('nav-button', 'next-button');
      navContainer.appendChild(nextButton);
  }
}

document.addEventListener('DOMContentLoaded', generateNavButtons);