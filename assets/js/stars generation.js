function generateStarsAndPlanets(starCount, planetCount) {
    const starsContainer = document.querySelector('.stars');

    // Generate stars
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.classList.add('star');

        // Random size for the star (1px to 4px)
        const starSize = Math.random() * 3 + 1;
        star.style.width = `${starSize}px`;
        star.style.height = `${starSize}px`;

        // Random position for the star
        const positionX = Math.random() * window.innerWidth;
        const positionY = Math.random() * window.innerHeight;
        star.style.top = `${positionY}px`;
        star.style.left = `${positionX}px`;

        // Assign a random animation speed
        const speed = Math.random() * 30 + 20;
        star.style.animationDuration = `${speed}s`;

        starsContainer.appendChild(star);
    }

    // Generate planets
    for (let i = 0; i < planetCount; i++) {
        const planet = document.createElement('div');
        planet.classList.add('planet');

        // Random size for the planet (5px to 20px)
        const planetSize = Math.random() * 15 + 5;
        planet.style.width = `${planetSize}px`;
        planet.style.height = `${planetSize}px`;

        // Random position for the planet (within a smaller radius to avoid the center text)
        const positionX = Math.random() * window.innerWidth * 0.8 + window.innerWidth * 0.1;
        const positionY = Math.random() * window.innerHeight * 0.6 + window.innerHeight * 0.2;
        planet.style.top = `${positionY}px`;
        planet.style.left = `${positionX}px`;

        // Assign a random orbital speed (slower than stars)
        const speed = Math.random() * 50 + 60;
        planet.style.animationDuration = `${speed}s`;

        starsContainer.appendChild(planet);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    generateStarsAndPlanets(100, 3);  // Generate 100 stars and 3 planets
});

//for theory section 
document.addEventListener('DOMContentLoaded', function() {
    const starsContainer = document.querySelector('.planet-container .stars'); // Target only the stars in planet-container
    if (starsContainer) {
        for (let i = 0; i < 100; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.animationDuration = `${Math.random() * 3 + 2}s`;
            starsContainer.appendChild(star);
        }
    }
});



