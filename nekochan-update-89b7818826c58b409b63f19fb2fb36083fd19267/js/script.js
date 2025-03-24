document.addEventListener('DOMContentLoaded', function() {
    // Search functionality
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');

    function performSearch() {
        const query = searchInput.value.trim();
        if (query) {
            window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
            searchInput.value = '';
        }
    }

    searchButton.addEventListener('click', performSearch);
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // Media player controls
    const playPauseButton = document.getElementById('play-pause');
    let isPlaying = false;

    playPauseButton.addEventListener('click', function() {
        isPlaying = !isPlaying;
        if (isPlaying) {
            playPauseButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                </svg>
            `;
        } else {
            playPauseButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                </svg>
            `;
        }
    });

    // Add some particle effects to the background
    createParticles();
});

function createParticles() {
    const container = document.querySelector('.container');
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles-container';
    particlesContainer.style.position = 'absolute';
    particlesContainer.style.top = '0';
    particlesContainer.style.left = '0';
    particlesContainer.style.width = '100%';
    particlesContainer.style.height = '100%';
    particlesContainer.style.overflow = 'hidden';
    particlesContainer.style.pointerEvents = 'none';
    particlesContainer.style.zIndex = '-1';
    
    document.body.insertBefore(particlesContainer, document.body.firstChild);
    
    for (let i = 0; i < 50; i++) {
        createParticle(particlesContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.position = 'absolute';
    particle.style.width = Math.random() * 3 + 1 + 'px';
    particle.style.height = particle.style.width;
    particle.style.backgroundColor = 'rgba(255, 255, 255, ' + (Math.random() * 0.3 + 0.1) + ')';
    particle.style.borderRadius = '50%';
    particle.style.top = Math.random() * 100 + 'vh';
    particle.style.left = Math.random() * 100 + 'vw';
    particle.style.boxShadow = '0 0 ' + Math.random() * 10 + 'px rgba(255, 255, 255, 0.5)';
    
    const duration = Math.random() * 60 + 30;
    particle.style.animation = `float ${duration}s linear infinite`;
    
    const keyframes = `
        @keyframes float {
            0% {
                transform: translateY(0) translateX(0);
                opacity: ${Math.random() * 0.5 + 0.3};
            }
            50% {
                transform: translateY(-${Math.random() * 30 + 10}vh) translateX(${Math.random() * 20 - 10}vw);
                opacity: ${Math.random() * 0.5 + 0.5};
            }
            100% {
                transform: translateY(-${Math.random() * 50 + 20}vh) translateX(${Math.random() * 40 - 20}vw);
                opacity: 0;
            }
        }
    `;
    
    const style = document.createElement('style');
    style.innerHTML = keyframes;
    document.head.appendChild(style);
    
    container.appendChild(particle);
    
    // Remove and recreate particle after animation ends
    setTimeout(() => {
        container.removeChild(particle);
        document.head.removeChild(style);
        createParticle(container);
    }, duration * 1000);
}
