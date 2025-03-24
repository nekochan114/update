document.addEventListener('DOMContentLoaded', function() {
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

    // Audio player functionality - Estilo untitled.stream
    const audioPlayerContainer = document.getElementById('audio-player-container');
    const togglePlayerBtn = document.getElementById('toggle-player');
    const playPauseBtn = document.getElementById('play-pause');
    const prevBtn = document.getElementById('prev-track');
    const nextBtn = document.getElementById('next-track');
    const shuffleBtn = document.getElementById('shuffle');
    const repeatBtn = document.getElementById('repeat');
    const volumeBtn = document.getElementById('volume');
    const progressBar = document.getElementById('progress-bar');
    const progressFill = document.getElementById('progress-fill');
    const currentTimeEl = document.getElementById('current-time');
    const totalTimeEl = document.getElementById('total-time');
    const trackTitleEl = document.getElementById('track-title');
    const artistNameEl = document.getElementById('artist-name');
    const albumArtEl = document.getElementById('album-art');
    const playlistEl = document.getElementById('playlist');

    // Audio library - Canciones de ejemplo con URLs reales
    const audioLibrary = [
        // Breakcore artists
        {
            artist: 'Sewerslvt',
            album: 'Draining Love Story',
            tracks: [
                { title: 'Ecifircas', file: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Yung_Kartz/August_2019/Yung_Kartz_-_01_-_Eternity.mp3' },
                { title: 'Mr. Kill Myself', file: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Yung_Kartz/August_2019/Yung_Kartz_-_02_-_Progression.mp3' },
                { title: 'Inlove', file: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Yung_Kartz/August_2019/Yung_Kartz_-_03_-_Memories.mp3' }
            ]
        },
        {
            artist: 'Death Dynamic Shroud',
            album: 'Faith In Persona',
            tracks: [
                { title: 'Ghost', file: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Kai_Engel/Satin/Kai_Engel_-_03_-_Contention.mp3' },
                { title: 'Judgment Bolt', file: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Kai_Engel/Satin/Kai_Engel_-_05_-_Downfall.mp3' }
            ]
        },
        {
            artist: 'Sabuze',
            album: 'Breakcore Mix',
            tracks: [
                { title: 'Neon Lights', file: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Ketsa/Raising_Frequency/Ketsa_-_08_-_Multiverse.mp3' },
                { title: 'Digital Dreams', file: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Chad_Crouch/Arps/Chad_Crouch_-_Algorithms.mp3' }
            ]
        },
        {
            artist: '2hollis',
            album: 'Breakcore Collection',
            tracks: [
                { title: 'Hyperspace', file: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Kai_Engel/Satin/Kai_Engel_-_07_-_Anxiety.mp3' },
                { title: 'Glitch Reality', file: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Kai_Engel/Satin/Kai_Engel_-_08_-_Illumination.mp3' }
            ]
        },
        {
            artist: 'Remilia Bandxz',
            album: 'Digital Fragments',
            tracks: [
                { title: 'Broken Pixels', file: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Chad_Crouch/Arps/Chad_Crouch_-_Shipping_Lanes.mp3' },
                { title: 'Cyber Tears', file: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Chad_Crouch/Arps/Chad_Crouch_-_Moonrise.mp3' }
            ]
        },
        // Kanye West latest album (usando música libre con derechos de uso)
        {
            artist: 'Kanye West',
            album: 'Vultures 1',
            tracks: [
                { title: 'Stars', file: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/WFMU/Broke_For_Free/Directionless_EP/Broke_For_Free_-_01_-_Night_Owl.mp3' },
                { title: 'Talking', file: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Tours/Enthusiast/Tours_-_01_-_Enthusiast.mp3' },
                { title: 'Vultures', file: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Chad_Crouch/Arps/Chad_Crouch_-_Skatepark.mp3' }
            ]
        },
        // Playboi Carti latest album (usando música libre con derechos de uso)
        {
            artist: 'Playboi Carti',
            album: 'Music',
            tracks: [
                { title: 'H00DBYAIR', file: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Tours/Enthusiast/Tours_-_01_-_Enthusiast.mp3' },
                { title: 'BACKR00MS', file: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Chad_Crouch/Arps/Chad_Crouch_-_Rainbow_Architecture.mp3' },
                { title: '2024', file: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Chad_Crouch/Arps/Chad_Crouch_-_Shipping_Lanes.mp3' }
            ]
        }
    ];

    // Current state
    let currentAlbumIndex = 0;
    let currentTrackIndex = 0;
    let isPlaying = false;
    let isShuffled = false;
    let repeatMode = 'none'; // 'none', 'one', 'all'
    let audio = new Audio();
    
    // Toggle player visibility
    togglePlayerBtn.addEventListener('click', function() {
        audioPlayerContainer.classList.toggle('minimized');
        if (audioPlayerContainer.classList.contains('minimized')) {
            togglePlayerBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M7 14l5-5 5 5z"/></svg>';
        } else {
            togglePlayerBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>';
        }
    });

    // Initialize player with first track
    function initPlayer() {
        loadTrack(currentAlbumIndex, currentTrackIndex);
        updatePlaylist();
    }

    // Load track
    function loadTrack(albumIndex, trackIndex) {
        currentAlbumIndex = albumIndex;
        currentTrackIndex = trackIndex;
        
        const album = audioLibrary[albumIndex];
        const track = album.tracks[trackIndex];
        
        // Detener la reproducción actual y cargar la nueva pista
        audio.pause();
        audio.src = track.file;
        audio.load();
        
        trackTitleEl.textContent = track.title;
        artistNameEl.textContent = album.artist;
        
        // Intentar cargar la imagen del álbum, o usar una imagen predeterminada
        try {
            albumArtEl.src = `images/albums/${album.artist.toLowerCase().replace(/\s+/g, '_')}.jpg`;
            albumArtEl.onerror = function() {
                albumArtEl.src = 'https://via.placeholder.com/50x50?text=Album';
            };
        } catch (e) {
            albumArtEl.src = 'https://via.placeholder.com/50x50?text=Album';
        }
        
        albumArtEl.alt = `${album.artist} - ${album.album}`;
        
        // Actualizar tiempos
        currentTimeEl.textContent = '0:00';
        
        // Reiniciar la barra de progreso
        progressFill.style.width = '0%';
        
        // Configurar eventos de audio
        audio.addEventListener('loadedmetadata', function() {
            totalTimeEl.textContent = formatTime(audio.duration);
        });
        
        // Configurar seguimiento de progreso
        audio.addEventListener('timeupdate', updateProgress);
        
        // Reproducir automáticamente la siguiente pista cuando termine la actual
        audio.addEventListener('ended', playNextTrack);
        
        // Actualizar la lista de reproducción para resaltar la pista actual
        updatePlaylist();
    }

    // Formatear tiempo en mm:ss
    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // Actualizar barra de progreso
    function updateProgress() {
        if (isNaN(audio.duration)) return;
        const percent = (audio.currentTime / audio.duration) * 100;
        progressFill.style.width = `${percent}%`;
        currentTimeEl.textContent = formatTime(audio.currentTime);
    }

    // Reproducir/Pausar
    playPauseBtn.addEventListener('click', togglePlayPause);
    
    function togglePlayPause() {
        if (isPlaying) {
            audio.pause();
            playPauseBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
        } else {
            const playPromise = audio.play();
            
            if (playPromise !== undefined) {
                playPromise.then(_ => {
                    // Reproducción iniciada con éxito
                    playPauseBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
                }).catch(error => {
                    // Error al iniciar la reproducción (común en navegadores que bloquean la reproducción automática)
                    console.error("Error al reproducir audio:", error);
                    isPlaying = false;
                    playPauseBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
                });
            }
        }
        isPlaying = !isPlaying;
    }

    // Pista anterior
    prevBtn.addEventListener('click', playPrevTrack);
    
    function playPrevTrack() {
        if (audio.currentTime > 3) {
            // Si llevamos más de 3 segundos en la canción, reiniciar la canción actual
            audio.currentTime = 0;
        } else {
            // Ir a la pista anterior
            currentTrackIndex--;
            if (currentTrackIndex < 0) {
                currentAlbumIndex = (currentAlbumIndex - 1 + audioLibrary.length) % audioLibrary.length;
                currentTrackIndex = audioLibrary[currentAlbumIndex].tracks.length - 1;
            }
            loadTrack(currentAlbumIndex, currentTrackIndex);
            if (isPlaying) {
                audio.play().catch(e => console.error("Error al reproducir audio:", e));
            }
        }
    }

    // Siguiente pista
    nextBtn.addEventListener('click', playNextTrack);
    
    function playNextTrack() {
        if (repeatMode === 'one') {
            // Repetir pista actual
            audio.currentTime = 0;
            audio.play().catch(e => console.error("Error al reproducir audio:", e));
            return;
        }
        
        // Ir a la siguiente pista
        currentTrackIndex++;
        if (currentTrackIndex >= audioLibrary[currentAlbumIndex].tracks.length) {
            if (repeatMode === 'all' || isShuffled) {
                currentAlbumIndex = (currentAlbumIndex + 1) % audioLibrary.length;
                currentTrackIndex = 0;
            } else {
                // Detenerse al final del álbum
                currentTrackIndex = audioLibrary[currentAlbumIndex].tracks.length - 1;
                isPlaying = false;
                playPauseBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
                return;
            }
        }
        loadTrack(currentAlbumIndex, currentTrackIndex);
        if (isPlaying) {
            audio.play().catch(e => console.error("Error al reproducir audio:", e));
        }
    }

    // Aleatorio
    shuffleBtn.addEventListener('click', function() {
        isShuffled = !isShuffled;
        shuffleBtn.classList.toggle('active', isShuffled);
    });

    // Repetir
    repeatBtn.addEventListener('click', function() {
        switch (repeatMode) {
            case 'none':
                repeatMode = 'all';
                repeatBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/></svg>';
                repeatBtn.classList.add('active');
                break;
            case 'all':
                repeatMode = 'one';
                repeatBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4zm-4-2V9h-1l-2 1v1h1.5v4H13z"/></svg>';
                repeatBtn.classList.add('active');
                break;
            case 'one':
                repeatMode = 'none';
                repeatBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/></svg>';
                repeatBtn.classList.remove('active');
                break;
        }
    });

    // Control de volumen
    volumeBtn.addEventListener('click', function() {
        if (audio.volume > 0) {
            audio.volume = 0;
            volumeBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>';
            volumeBtn.classList.add('active');
        } else {
            audio.volume = 1;
            volumeBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>';
            volumeBtn.classList.remove('active');
        }
    });

    // Clic en la barra de progreso
    progressBar.addEventListener('click', function(e) {
        if (isNaN(audio.duration)) return;
        const rect = progressBar.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        audio.currentTime = percent * audio.duration;
        progressFill.style.width = `${percent * 100}%`;
    });

    // Actualizar lista de reproducción
    function updatePlaylist() {
        playlistEl.innerHTML = '';
        
        audioLibrary.forEach((album, albumIndex) => {
            const albumEl = document.createElement('div');
            albumEl.className = 'playlist-album';
            
            const albumHeader = document.createElement('div');
            albumHeader.className = 'playlist-album-header';
            albumHeader.innerHTML = `
                <h3>${album.artist} - ${album.album}</h3>
            `;
            albumEl.appendChild(albumHeader);
            
            const tracksList = document.createElement('div');
            tracksList.className = 'playlist-tracks';
            
            album.tracks.forEach((track, trackIndex) => {
                const trackEl = document.createElement('div');
                trackEl.className = 'playlist-track';
                if (albumIndex === currentAlbumIndex && trackIndex === currentTrackIndex) {
                    trackEl.classList.add('active');
                }
                trackEl.innerHTML = `<span>${track.title}</span>`;
                trackEl.addEventListener('click', function() {
                    loadTrack(albumIndex, trackIndex);
                    isPlaying = true;
                    audio.play().catch(e => console.error("Error al reproducir audio:", e));
                    playPauseBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
                });
                tracksList.appendChild(trackEl);
            });
            
            albumEl.appendChild(tracksList);
            playlistEl.appendChild(albumEl);
        });
    }

    // Inicializar reproductor
    initPlayer();

    // Agregar efectos de partículas al fondo
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
    
    // Eliminar y recrear partícula después de que termine la animación
    setTimeout(() => {
        container.removeChild(particle);
        document.head.removeChild(style);
        createParticle(container);
    }, duration * 1000);
}
