document.addEventListener('DOMContentLoaded', function() {
    // Agregar elementos del fondo galaxia
    const starsContainer = document.createElement('div');
    starsContainer.className = 'stars-container';
    
    const stars1 = document.createElement('div');
    stars1.className = 'stars';
    
    const stars2 = document.createElement('div');
    stars2.className = 'stars2';
    
    const stars3 = document.createElement('div');
    stars3.className = 'stars3';
    
    const nebula = document.createElement('div');
    nebula.className = 'nebula';
    
    const galaxyGlow = document.createElement('div');
    galaxyGlow.className = 'galaxy-glow';
    
    starsContainer.appendChild(stars1);
    starsContainer.appendChild(stars2);
    starsContainer.appendChild(stars3);
    starsContainer.appendChild(nebula);
    document.body.appendChild(starsContainer);
    document.body.appendChild(galaxyGlow);

    // Search functionality
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const rgbTube = document.getElementById('rgb-tube');
    const rgbTubeFill = document.getElementById('rgb-tube-fill');

    function performSearch() {
        const query = searchInput.value.trim();
        if (query) {
            window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
            searchInput.value = '';
            // Reset RGB tube fill
            rgbTubeFill.style.width = '0%';
        }
    }

    searchButton.addEventListener('click', performSearch);
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // Update RGB tube fill based on input length
    searchInput.addEventListener('input', function() {
        const inputLength = searchInput.value.length;
        const maxLength = 50; // Arbitrary max length for full fill
        const fillPercentage = Math.min(inputLength / maxLength * 100, 100);
        rgbTubeFill.style.width = fillPercentage + '%';
    });

    // Crear el reproductor de YouTube
    createYoutubePlayer();
    
    // Hacer que las tarjetas sociales redireccionen a sus respectivas páginas
    setupSocialCards();
});

// Función para configurar las tarjetas sociales
function setupSocialCards() {
    const socialCards = document.querySelectorAll('.social-card');
    
    const urls = {
        'Twitch': 'https://www.twitch.tv',
        'YouTube': 'https://www.youtube.com',
        'X.com': 'https://twitter.com',
        '4chan': 'https://www.4chan.org'
    };
    
    socialCards.forEach(card => {
        const title = card.querySelector('h3').textContent;
        if (urls[title]) {
            card.addEventListener('click', function() {
                window.open(urls[title], '_blank');
            });
            card.style.cursor = 'pointer';
        }
    });
}

// Función para crear el reproductor de YouTube
function createYoutubePlayer() {
    // Crear el contenedor principal
    const youtubePlayerContainer = document.createElement('div');
    youtubePlayerContainer.id = 'youtube-player-container';
    youtubePlayerContainer.className = 'youtube-player-container';
    
    // Crear el encabezado
    const header = document.createElement('div');
    header.className = 'youtube-player-header';
    
    // Crear la miniatura (usando la imagen de Miku)
    const thumbnail = document.createElement('img');
    thumbnail.className = 'youtube-thumbnail';
    thumbnail.src = 'images/miku.gif';
    thumbnail.alt = 'Miku Thumbnail';
    
    // Crear el título
    const titleContainer = document.createElement('div');
    titleContainer.className = 'youtube-player-title';
    
    const videoTitle = document.createElement('div');
    videoTitle.className = 'video-title';
    videoTitle.textContent = 'Reproductor de YouTube';
    
    const channelName = document.createElement('div');
    channelName.className = 'channel-name';
    channelName.textContent = 'Pega un enlace para comenzar';
    
    titleContainer.appendChild(videoTitle);
    titleContainer.appendChild(channelName);
    
    // Crear el botón de toggle
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'youtube-player-toggle';
    toggleBtn.id = 'toggle-youtube-player';
    toggleBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>';
    
    // Agregar elementos al encabezado
    header.appendChild(thumbnail);
    header.appendChild(titleContainer);
    header.appendChild(toggleBtn);
    
    // Crear el contenedor del iframe
    const frameContainer = document.createElement('div');
    frameContainer.className = 'youtube-frame-container';
    frameContainer.id = 'youtube-frame-container';
    
    // Crear el iframe (inicialmente vacío)
    const iframe = document.createElement('iframe');
    iframe.className = 'youtube-frame';
    iframe.id = 'youtube-frame';
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
    
    frameContainer.appendChild(iframe);
    
    // Crear el contenedor de búsqueda
    const searchContainer = document.createElement('div');
    searchContainer.className = 'youtube-search-container';
    
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.className = 'youtube-search-input';
    searchInput.id = 'youtube-search-input';
    searchInput.placeholder = 'Pega un enlace de YouTube o ID de video';
    
    const searchButton = document.createElement('button');
    searchButton.className = 'youtube-search-button';
    searchButton.id = 'youtube-search-button';
    searchButton.textContent = 'Cargar';
    
    searchContainer.appendChild(searchInput);
    searchContainer.appendChild(searchButton);
    
    // Crear el historial
    const history = document.createElement('div');
    history.className = 'youtube-history';
    history.id = 'youtube-history';
    
    // Agregar todos los elementos al contenedor principal
    youtubePlayerContainer.appendChild(header);
    youtubePlayerContainer.appendChild(frameContainer);
    youtubePlayerContainer.appendChild(searchContainer);
    youtubePlayerContainer.appendChild(history);
    
    // Agregar el contenedor al body
    document.body.appendChild(youtubePlayerContainer);
    
    // Configurar eventos después de que los elementos estén en el DOM
    setTimeout(() => {
        setupYoutubePlayerEvents();
    }, 0);
}

// Configurar eventos del reproductor de YouTube
function setupYoutubePlayerEvents() {
    const youtubePlayerContainer = document.getElementById('youtube-player-container');
    const toggleBtn = document.getElementById('toggle-youtube-player');
    const searchInput = document.getElementById('youtube-search-input');
    const searchButton = document.getElementById('youtube-search-button');
    const iframe = document.getElementById('youtube-frame');
    const history = document.getElementById('youtube-history');
    const videoTitle = document.querySelector('.video-title');
    const channelName = document.querySelector('.channel-name');
    const thumbnail = document.querySelector('.youtube-thumbnail');
    
    // Historial de videos
    let videoHistory = [];
    
    // Toggle para minimizar/maximizar el reproductor
    toggleBtn.addEventListener('click', function() {
        youtubePlayerContainer.classList.toggle('minimized');
        if (youtubePlayerContainer.classList.contains('minimized')) {
            toggleBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M7 14l5-5 5 5z"/></svg>';
        } else {
            toggleBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>';
        }
    });
    
    // Función para extraer el ID de video de una URL de YouTube
    function extractVideoId(url) {
        if (!url) return null;
        
        // Si es solo un ID de video
        if (url.length === 11) return url;
        
        // Patrones comunes de URLs de YouTube
        const regExp = /^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        
        return (match && match[2].length === 11) ? match[2] : null;
    }
    
    // Función para cargar un video
    function loadVideo(videoId, videoInfo = {}) {
        if (!videoId) return;
        
        // Actualizar iframe
        iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        
        // Actualizar información del video
        const title = videoInfo.title || 'Video de YouTube';
        const channel = videoInfo.channel || 'Canal desconocido';
        
        videoTitle.textContent = title;
        channelName.textContent = channel;
        
        // Mantener la imagen de Miku como miniatura
        if (videoId !== 'jhl5afLEKdo') {
            thumbnail.src = 'images/miku.gif';
        }
        
        // Agregar al historial si no existe
        const existingIndex = videoHistory.findIndex(v => v.id === videoId);
        if (existingIndex === -1) {
            videoHistory.unshift({
                id: videoId,
                title: title,
                channel: channel
            });
            
            // Limitar historial a 10 elementos
            if (videoHistory.length > 10) {
                videoHistory.pop();
            }
        } else {
            // Mover al principio si ya existe
            const item = videoHistory.splice(existingIndex, 1)[0];
            videoHistory.unshift(item);
        }
        
        // Actualizar la visualización del historial
        updateHistoryDisplay();
        
        // Limpiar el input
        searchInput.value = '';
    }
    
    // Función para actualizar la visualización del historial
    function updateHistoryDisplay() {
        history.innerHTML = '';
        
        videoHistory.forEach(video => {
            const historyItem = document.createElement('div');
            historyItem.className = 'youtube-history-item';
            historyItem.dataset.videoId = video.id;
            
            const historyThumbnail = document.createElement('img');
            historyThumbnail.className = 'youtube-history-thumbnail';
            historyThumbnail.src = 'images/miku.gif';
            historyThumbnail.alt = video.title;
            
            const historyInfo = document.createElement('div');
            historyInfo.className = 'youtube-history-info';
            
            const historyTitle = document.createElement('div');
            historyTitle.className = 'youtube-history-title';
            historyTitle.textContent = video.title;
            
            historyInfo.appendChild(historyTitle);
            
            historyItem.appendChild(historyThumbnail);
            historyItem.appendChild(historyInfo);
            
            historyItem.addEventListener('click', function() {
                loadVideo(video.id, {
                    title: video.title,
                    channel: video.channel
                });
            });
            
            history.appendChild(historyItem);
        });
    }
    
    // Evento para el botón de búsqueda
    searchButton.addEventListener('click', function() {
        const input = searchInput.value.trim();
        const videoId = extractVideoId(input);
        
        if (videoId) {
            loadVideo(videoId);
        } else {
            alert('Por favor, introduce un enlace de YouTube válido o ID de video');
        }
    });
    
    // Evento para el input (Enter)
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const input = searchInput.value.trim();
            const videoId = extractVideoId(input);
            
            if (videoId) {
                loadVideo(videoId);
            } else {
                alert('Por favor, introduce un enlace de YouTube válido o ID de video');
            }
        }
    });
    
    // Cargar un video de Miku al inicio
    loadVideo('jhl5afLEKdo', {
        title: 'Hatsune Miku',
        channel: 'Vocaloid'
    });
}
