// navigation.js
function loadNavigation() {
    const navHTML = `
        <nav>
            <div class="nav-container">
                <div class="logo">
                    <a href="/index.html">MySite</a>
                </div>
                <div class="menu-icon" id="menu-icon">
                    <i class="fas fa-bars"></i>
                </div>
                <ul class="nav-links" id="nav-links">
                    <li><a href="/index.html">Home</a></li>
                    <li><a href="/pages/about/index.html">About</a></li>
                    <li><a href="/pages/design/index.html">Data Visualisation</a></li>
                    <li><a href="/pages/data-visualisation/index.html">Design</a></li>
                    <li><a href="/pages/more-information/index.html">More information</a></li>
                
                </ul>
            </div>
        </nav>
    `;
    document.getElementById('navbar').innerHTML = navHTML;

    // Responsive navbar functionality
    const menuIcon = document.getElementById('menu-icon');
    const navLinks = document.getElementById('nav-links');

    menuIcon.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

window.onload = loadNavigation;
