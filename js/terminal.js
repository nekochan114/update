document.addEventListener('DOMContentLoaded', function() {
    const terminal = document.querySelector('.terminal');
    const terminalContent = document.querySelector('.terminal-content');
    const terminalInput = document.createElement('div');
    terminalInput.className = 'terminal-input';
    terminalContent.appendChild(terminalInput);

    // Crear el prompt y el input
    const promptSpan = document.createElement('span');
    promptSpan.className = 'prompt';
    promptSpan.textContent = '$ ';
    
    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.className = 'terminal-input-field';
    inputField.autocomplete = 'off';
    inputField.spellcheck = false;
    
    terminalInput.appendChild(promptSpan);
    terminalInput.appendChild(inputField);

    // Historial de comandos
    const commandHistory = [];
    let historyIndex = -1;
    
    // Estado para comandos interactivos
    let interactiveMode = false;
    let currentInteractiveCommand = null;
    let interactiveState = {};
    
    // Comandos disponibles
    const commands = {
        'help': function() {
            return `Comandos disponibles:
- help: Muestra esta ayuda
- clear: Limpia la terminal
- ani-cli: Busca y reproduce anime
- pokemon-colorscripts: Muestra arte ASCII de Pokémon
- ls: Lista archivos
- cd: Cambia directorio
- echo: Muestra texto
- exit: Cierra la terminal`;
        },
        'clear': function() {
            // Eliminar todos los elementos excepto el input
            const children = Array.from(terminalContent.children);
            for (const child of children) {
                if (child !== terminalInput) {
                    terminalContent.removeChild(child);
                }
            }
            return null; // No mostrar salida
        },
        'ani-cli': function(args) {
            if (interactiveMode && currentInteractiveCommand === 'ani-cli') {
                // Manejar el estado interactivo de ani-cli
                switch (interactiveState.step) {
                    case 'enter_anime':
                        const animeName = args.join(' ');
                        interactiveState.animeName = animeName;
                        interactiveState.step = 'select_anime';
                        return `Searching for "${animeName}"...
Found 5 results:
1. ${animeName} (TV)
2. ${animeName} Movie
3. ${animeName} OVA
4. ${animeName} Season 2
5. ${animeName} Special

Enter choice (1-5): `;
                    
                    case 'select_anime':
                        const choice = parseInt(args[0]);
                        if (isNaN(choice) || choice < 1 || choice > 5) {
                            return `Invalid choice. Please enter a number between 1 and 5: `;
                        }
                        interactiveState.animeChoice = choice;
                        interactiveState.step = 'select_episode';
                        return `Selected: ${interactiveState.animeName} ${choice === 1 ? '(TV)' : 
                                choice === 2 ? 'Movie' : 
                                choice === 3 ? 'OVA' : 
                                choice === 4 ? 'Season 2' : 'Special'}

Loading episode list...
Found 12 episodes.

[1] Episode 1
[2] Episode 2
[3] Episode 3
[4] Episode 4
[5] Episode 5
[6] Episode 6
[7] Episode 7
[8] Episode 8
[9] Episode 9
[10] Episode 10
[11] Episode 11
[12] Episode 12

Enter episode number (1-12): `;
                    
                    case 'select_episode':
                        const episode = parseInt(args[0]);
                        if (isNaN(episode) || episode < 1 || episode > 12) {
                            return `Invalid episode. Please enter a number between 1 and 12: `;
                        }
                        
                        // Finalizar el modo interactivo
                        interactiveMode = false;
                        currentInteractiveCommand = null;
                        
                        return `Selected: Episode ${episode}

Loading video sources...
Found 3 video sources:
1. Source 1 (1080p)
2. Source 2 (720p)
3. Source 3 (480p)

Selected Source 1 (1080p)
Starting playback...

[===>---------------------] 15%

Presiona Ctrl+C para detener la reproducción.

(Simulación de reproducción de anime)`;
                }
            } else {
                // Iniciar el modo interactivo para ani-cli
                interactiveMode = true;
                currentInteractiveCommand = 'ani-cli';
                interactiveState = {
                    step: 'enter_anime'
                };
                
                return `Searching anime via Gogoanime...
Enter the anime name: `;
            }
        },
        'pokemon-colorscripts': function(args) {
            if (interactiveMode && currentInteractiveCommand === 'pokemon-colorscripts') {
                // Manejar el estado interactivo de pokemon-colorscripts
                switch (interactiveState.step) {
                    case 'enter_pokemon':
                        const pokemonName = args.join(' ').toLowerCase();
                        const foundPokemon = pokemons.find(p => p.name.toLowerCase() === pokemonName);
                        
                        if (foundPokemon) {
                            // Finalizar el modo interactivo
                            interactiveMode = false;
                            currentInteractiveCommand = null;
                            
                            return `${foundPokemon.name}${foundPokemon.art}`;
                        } else {
                            return `Pokémon "${args.join(' ')}" no encontrado.
Intenta con otro nombre o escribe 'list' para ver los disponibles: `;
                        }
                        
                    case 'list_pokemon':
                        if (args[0] === 'back') {
                            interactiveState.step = 'enter_pokemon';
                            return `Ingresa el nombre del Pokémon: `;
                        }
                        
                        const page = parseInt(args[0]) || 1;
                        const itemsPerPage = 5;
                        const start = (page - 1) * itemsPerPage;
                        const end = Math.min(start + itemsPerPage, pokemons.length);
                        
                        let output = `Pokémon disponibles (página ${page}/${Math.ceil(pokemons.length/itemsPerPage)}):\n`;
                        for (let i = start; i < end; i++) {
                            output += `${i+1}. ${pokemons[i].name}\n`;
                        }
                        
                        output += `\nEscribe un número para seleccionar, 'next' para la siguiente página, 'prev' para la anterior, o 'back' para volver: `;
                        
                        return output;
                }
            } else if (args && args.includes('-r')) {
                // Mostrar un Pokémon aleatorio
                const randomPokemon = pokemons[Math.floor(Math.random() * pokemons.length)];
                return `${randomPokemon.name}${randomPokemon.art}`;
            } else if (args && args.length > 0 && args[0] === 'list') {
                // Iniciar modo interactivo para listar Pokémon
                interactiveMode = true;
                currentInteractiveCommand = 'pokemon-colorscripts';
                interactiveState = {
                    step: 'list_pokemon'
                };
                
                return commands['pokemon-colorscripts'](['1']);
            } else if (args && args.length > 0) {
                // Buscar un Pokémon específico
                const pokemonName = args[0].toLowerCase();
                const foundPokemon = pokemons.find(p => p.name.toLowerCase() === pokemonName);
                
                if (foundPokemon) {
                    return `${foundPokemon.name}${foundPokemon.art}`;
                } else {
                    // Iniciar modo interactivo para buscar Pokémon
                    interactiveMode = true;
                    currentInteractiveCommand = 'pokemon-colorscripts';
                    interactiveState = {
                        step: 'enter_pokemon'
                    };
                    
                    return `Pokémon "${args[0]}" no encontrado.
Intenta con otro nombre o escribe 'list' para ver los disponibles: `;
                }
            } else {
                // Iniciar modo interactivo para pokemon-colorscripts
                interactiveMode = true;
                currentInteractiveCommand = 'pokemon-colorscripts';
                interactiveState = {
                    step: 'enter_pokemon'
                };
                
                return `Uso: pokemon-colorscripts [-r] [nombre]
  -r: Muestra un Pokémon aleatorio
  list: Muestra la lista de Pokémon disponibles

Ingresa el nombre del Pokémon: `;
            }
        },
        'ls': function() {
            return `Desktop  Documents  Downloads  Music  Pictures  Videos`;
        },
        'cd': function(args) {
            if (!args || args.length === 0) {
                return ``;
            } else {
                return `Cambiado al directorio ${args[0]}`;
            }
        },
        'echo': function(args) {
            if (!args || args.length === 0) {
                return ``;
            } else {
                return args.join(' ');
            }
        },
        'exit': function() {
            terminal.style.display = 'none';
            return null;
        }
    };

    // Base de datos de Pokémon
    const pokemons = [
        {
            name: 'Pikachu',
            art: `
    ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
    ⬛⬛⬛⬛⬛⬛⬛🟨🟨⬛⬛⬛⬛⬛⬛
    ⬛⬛⬛⬛⬛⬛🟨🟨🟨🟨⬛⬛⬛⬛⬛
    ⬛⬛⬛⬛⬛🟨🟨🟨🟨🟨🟨⬛⬛⬛⬛
    ⬛⬛⬛⬛🟨🟨🟨🟨🟨🟨🟨🟨⬛⬛⬛
    ⬛⬛⬛⬛🟨🟨🟨🟨🟨🟨🟨🟨⬛⬛⬛
    ⬛⬛⬛⬛🟨🟨🟨🟨🟨🟨🟨🟨⬛⬛⬛
    ⬛⬛⬛⬛⬛🟥🟨🟨🟨🟨🟥⬛⬛⬛⬛
    ⬛⬛⬛⬛⬛⬛🟨🟨🟨🟨⬛⬛⬛⬛⬛
    ⬛⬛⬛🟨🟨🟨🟨🟨🟨🟨🟨🟨🟨⬛⬛
    ⬛⬛🟨🟨🟨🟨🟨🟨🟨🟨🟨🟨🟨🟨⬛
    ⬛⬛🟨🟨🟨🟨🟨🟨🟨🟨🟨🟨🟨🟨⬛
    ⬛⬛🟨🟨🟨🟨🟨🟨🟨🟨🟨🟨🟨🟨⬛
    ⬛⬛⬛🟨🟨🟨⬛⬛⬛⬛🟨🟨🟨⬛⬛
    ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛`
        },
        {
            name: 'Charizard',
            art: `
    ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
    ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛🟧⬛⬛⬛⬛⬛⬛
    ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛🟧🟧🟧⬛⬛⬛⬛⬛
    ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛🟧🟧🟧🟧🟧⬛⬛⬛⬛
    ⬛⬛⬛⬛⬛⬛⬛⬛⬛🟧🟧🟧🟧🟧🟧🟧⬛⬛⬛
    ⬛⬛⬛⬛⬛⬛⬛⬛🟧🟧🟧🟧🟧🟧🟧🟧🟧⬛⬛
    ⬛⬛⬛⬛⬛⬛⬛🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧⬛
    ⬛⬛⬛⬛⬛⬛🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧⬛
    ⬛⬛⬛⬛⬛🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧⬛
    ⬛⬛⬛⬛🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧⬛
    ⬛⬛⬛🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧⬛⬛
    ⬛⬛🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧⬛⬛⬛
    ⬛🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧⬛⬛⬛⬛
    ⬛⬛🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧⬛⬛⬛⬛⬛⬛
    ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛`
        },
        {
            name: 'Bulbasaur',
            art: `
    ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
    ⬛⬛⬛⬛⬛⬛🟩🟩🟩🟩⬛⬛⬛⬛⬛
    ⬛⬛⬛⬛🟩🟩🟩🟩🟩🟩🟩⬛⬛⬛⬛
    ⬛⬛⬛🟩🟩🟩🟩🟩🟩🟩🟩🟩⬛⬛⬛
    ⬛⬛🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩⬛⬛
    ⬛⬛🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩⬛⬛
    ⬛⬛🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦⬛⬛
    ⬛🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦⬛
    ⬛🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦⬛
    ⬛🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦⬛
    ⬛🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦⬛
    ⬛⬛🟦🟦🟦🟦⬛⬛⬛🟦🟦🟦🟦⬛⬛
    ⬛⬛⬛🟦🟦⬛⬛⬛⬛⬛🟦🟦⬛⬛⬛
    ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛`
        },
        {
            name: 'Squirtle',
            art: `
    ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
    ⬛⬛⬛⬛⬛⬛🟦🟦🟦🟦⬛⬛⬛⬛⬛
    ⬛⬛⬛⬛⬛🟦🟦🟦🟦🟦🟦⬛⬛⬛⬛
    ⬛⬛⬛⬛🟦🟦🟦🟦🟦🟦🟦🟦⬛⬛⬛
    ⬛⬛⬛🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦⬛⬛
    ⬛⬛🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦⬛
    ⬛⬛🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦⬛
    ⬛⬛🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦⬛
    ⬛⬛🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦⬛
    ⬛⬛🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦⬛
    ⬛⬛🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦⬛
    ⬛⬛⬛🟦🟦🟦⬛⬛⬛⬛🟦🟦🟦⬛⬛
    ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛`
        },
        {
            name: 'Eevee',
            art: `
    ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
    ⬛⬛⬛⬛⬛⬛🟫🟫🟫🟫⬛⬛⬛⬛⬛
    ⬛⬛⬛⬛⬛🟫🟫🟫🟫🟫🟫⬛⬛⬛⬛
    ⬛⬛⬛⬛🟫🟫🟫🟫🟫🟫🟫🟫⬛⬛⬛
    ⬛⬛⬛🟫🟫🟫🟫🟫🟫🟫🟫🟫🟫⬛⬛
    ⬛⬛🟫🟫🟫🟫🟫🟫🟫🟫🟫🟫🟫🟫⬛
    ⬛⬛🟫🟫🟫🟫🟫🟫🟫🟫🟫🟫🟫🟫⬛
    ⬛⬛🟫🟫🟫🟫🟫🟫🟫🟫🟫🟫🟫🟫⬛
    ⬛⬛🟫🟫🟫🟫🟫🟫🟫🟫🟫🟫🟫🟫⬛
    ⬛⬛🟫🟫🟫🟫🟫🟫🟫🟫🟫🟫🟫🟫⬛
    ⬛⬛🟫🟫🟫🟫🟫🟫🟫🟫🟫🟫🟫🟫⬛
    ⬛⬛⬛🟫🟫🟫⬛⬛⬛⬛🟫🟫🟫⬛⬛
    ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛`
        },
        {
            name: 'Gengar',
            art: `
    ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
    ⬛⬛⬛⬛⬛⬛🟪🟪🟪🟪⬛⬛⬛⬛⬛
    ⬛⬛⬛⬛⬛🟪🟪🟪🟪🟪🟪⬛⬛⬛⬛
    ⬛⬛⬛⬛🟪🟪🟪🟪🟪🟪🟪🟪⬛⬛⬛
    ⬛⬛⬛🟪🟪🟪🟪🟪🟪🟪🟪🟪🟪⬛⬛
    ⬛⬛🟪🟪🟪🟪🟪🟪🟪🟪🟪🟪🟪🟪⬛
    ⬛⬛🟪🟪⬜⬜🟪🟪🟪🟪⬜⬜🟪🟪⬛
    ⬛⬛🟪🟪⬜⬜🟪🟪🟪🟪⬜⬜🟪🟪⬛
    ⬛⬛🟪🟪🟪🟪🟪🟪🟪🟪🟪🟪🟪🟪⬛
    ⬛⬛🟪🟪🟪🟪🟪🟪🟪🟪🟪🟪🟪🟪⬛
    ⬛⬛🟪🟪🟪🟪🟪🟪🟪🟪🟪🟪🟪🟪⬛
    ⬛⬛⬛🟪🟪🟪⬛⬛⬛⬛🟪🟪🟪⬛⬛
    ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛`
        },
        {
            name: 'Snorlax',
            art: `
    ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
    ⬛⬛⬛⬛⬛⬛🟦🟦🟦🟦⬛⬛⬛⬛⬛
    ⬛⬛⬛⬛⬛🟦🟦🟦🟦🟦🟦⬛⬛⬛⬛
    ⬛⬛⬛⬛🟦🟦🟦🟦🟦🟦🟦🟦⬛⬛⬛
    ⬛⬛⬛🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦⬛⬛
    ⬛⬛🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦⬛
    ⬛⬛🟦🟦🟦🟦⬛⬛⬛⬛🟦🟦🟦🟦⬛
    ⬛⬛🟦🟦🟦⬛⬛⬛⬛⬛⬛🟦🟦🟦⬛
    ⬛⬛🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦⬛
    ⬛⬛🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦⬛
    ⬛⬛🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦⬛
    ⬛⬛⬛🟦🟦🟦⬛⬛⬛⬛🟦🟦🟦⬛⬛
    ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛`
        },
        {
            name: 'Mewtwo',
            art: `
    ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
    ⬛⬛⬛⬛⬛⬛🟪🟪🟪🟪⬛⬛⬛⬛⬛
    ⬛⬛⬛⬛⬛🟪🟪🟪🟪🟪🟪⬛⬛⬛⬛
    ⬛⬛⬛⬛🟪🟪🟪🟪🟪🟪🟪🟪⬛⬛⬛
    ⬛⬛⬛🟪🟪🟪🟪🟪🟪🟪🟪🟪🟪⬛⬛
    ⬛⬛🟪🟪🟪🟪🟪🟪🟪🟪🟪🟪🟪🟪⬛
    ⬛⬛🟪🟪🟪🟪🟪🟪🟪🟪🟪🟪🟪🟪⬛
    ⬛⬛🟪🟪🟪🟪🟪🟪🟪🟪🟪🟪🟪🟪⬛
    ⬛⬛🟪🟪🟪🟪🟪🟪🟪🟪🟪🟪🟪🟪⬛
    ⬛⬛🟪🟪🟪🟪🟪🟪🟪🟪🟪🟪🟪🟪⬛
    ⬛⬛🟪🟪🟪🟪🟪🟪🟪🟪🟪🟪🟪🟪⬛
    ⬛⬛⬛🟪🟪🟪⬛⬛⬛⬛🟪🟪🟪⬛⬛
    ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛`
        },
        {
            name: 'Mew',
            art: `
    ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
    ⬛⬛⬛⬛⬛⬛🟪🟪🟪🟪⬛⬛⬛⬛⬛
    ⬛⬛⬛⬛⬛🟪🟪🟪🟪🟪🟪⬛⬛⬛⬛
    ⬛⬛⬛⬛🟪🟪🟪🟪🟪🟪🟪🟪⬛⬛⬛
    ⬛⬛⬛🟪🟪🟪🟪🟪🟪🟪🟪🟪🟪⬛⬛
    ⬛⬛🟪🟪🟪🟪🟪🟪🟪🟪🟪🟪🟪🟪⬛
    ⬛⬛🟪🟪🟪🟪🟪🟪🟪🟪🟪🟪🟪🟪⬛
    ⬛⬛🟪🟪🟪🟪🟪🟪🟪🟪🟪🟪🟪🟪⬛
    ⬛⬛🟪🟪🟪🟪🟪🟪🟪🟪🟪🟪🟪🟪⬛
    ⬛⬛🟪🟪🟪🟪🟪🟪🟪🟪🟪🟪🟪🟪⬛
    ⬛⬛🟪🟪🟪🟪🟪🟪🟪🟪🟪🟪🟪🟪⬛
    ⬛⬛⬛🟪🟪🟪⬛⬛⬛⬛🟪🟪🟪⬛⬛
    ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛`
        },
        {
            name: 'Gyarados',
            art: `
    ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
    ⬛⬛⬛⬛⬛⬛🟦🟦🟦🟦⬛⬛⬛⬛⬛
    ⬛⬛⬛⬛⬛🟦🟦🟦🟦🟦🟦⬛⬛⬛⬛
    ⬛⬛⬛⬛🟦🟦🟦🟦🟦🟦🟦🟦⬛⬛⬛
    ⬛⬛⬛🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦⬛⬛
    ⬛⬛🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦⬛
    ⬛⬛🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦⬛
    ⬛⬛🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦⬛
    ⬛⬛🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦⬛
    ⬛⬛🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦⬛
    ⬛⬛🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦⬛
    ⬛⬛⬛🟦🟦🟦⬛⬛⬛⬛🟦🟦🟦⬛⬛
    ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛`
        },
        {
            name: 'Dragonite',
            art: `
    ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
    ⬛⬛⬛⬛⬛⬛🟧🟧🟧🟧⬛⬛⬛⬛⬛
    ⬛⬛⬛⬛⬛🟧🟧🟧🟧🟧🟧⬛⬛⬛⬛
    ⬛⬛⬛⬛🟧🟧🟧🟧🟧🟧🟧🟧⬛⬛⬛
    ⬛⬛⬛🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧⬛⬛
    ⬛⬛🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧⬛
    ⬛⬛🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧⬛
    ⬛⬛🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧⬛
    ⬛⬛🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧⬛
    ⬛⬛🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧⬛
    ⬛⬛🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧⬛
    ⬛⬛⬛🟧🟧🟧⬛⬛⬛⬛🟧🟧🟧⬛⬛
    ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛`
        }
    ];

    // Función para procesar comandos
    function processCommand(commandText) {
        if (!commandText.trim()) return;
        
        // Si estamos en modo interactivo, no agregar al historial
        if (!interactiveMode) {
            // Agregar al historial
            commandHistory.push(commandText);
            historyIndex = commandHistory.length;
        }
        
        // Parsear el comando
        const args = commandText.trim().split(' ');
        const cmd = args.shift().toLowerCase();
        
        // Crear línea de comando
        const commandLine = document.createElement('div');
        commandLine.className = 'command-line';
        
        const prompt = document.createElement('span');
        prompt.className = 'prompt';
        prompt.textContent = '$ ';
        
        const command = document.createElement('span');
        command.className = 'command';
        command.textContent = commandText;
        
        commandLine.appendChild(prompt);
        commandLine.appendChild(command);
        
        // Insertar antes del input
        terminalContent.insertBefore(commandLine, terminalInput);
        
        // Ejecutar el comando
        let output = null;
        
        if (interactiveMode) {
            // Si estamos en modo interactivo, pasar el comando al manejador actual
            output = commands[currentInteractiveCommand](args);
        } else if (commands[cmd]) {
            // Si no estamos en modo interactivo, ejecutar el comando normalmente
            output = commands[cmd](args);
        } else {
            output = `${cmd}: comando no encontrado`;
        }
        
        if (output !== null) {
            const outputDiv = document.createElement('div');
            outputDiv.className = 'command-output';
            outputDiv.textContent = output;
            terminalContent.insertBefore(outputDiv, terminalInput);
        }
        
        // Limpiar el input
        inputField.value = '';
        
        // Scroll al final
        terminalContent.scrollTop = terminalContent.scrollHeight;
    }

    // Manejar eventos de teclado
    inputField.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            processCommand(inputField.value);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (!interactiveMode && historyIndex > 0) {
                historyIndex--;
                inputField.value = commandHistory[historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (!interactiveMode) {
                if (historyIndex < commandHistory.length - 1) {
                    historyIndex++;
                    inputField.value = commandHistory[historyIndex];
                } else {
                    historyIndex = commandHistory.length;
                    inputField.value = '';
                }
            }
        } else if (e.key === 'Tab') {
            e.preventDefault();
            // Autocompletar (simplificado)
            if (!interactiveMode) {
                const input = inputField.value.trim();
                if (input) {
                    const cmdPart = input.split(' ')[0];
                    const matches = Object.keys(commands).filter(cmd => cmd.startsWith(cmdPart));
                    if (matches.length === 1) {
                        inputField.value = matches[0] + (input.includes(' ') ? ' ' + input.split(' ').slice(1).join(' ') : ' ');
                    }
                }
            }
        } else if (e.key === 'c' && e.ctrlKey) {
            // Manejar Ctrl+C para cancelar comandos interactivos
            if (interactiveMode) {
                const outputDiv = document.createElement('div');
                outputDiv.className = 'command-output';
                outputDiv.textContent = '^C';
                terminalContent.insertBefore(outputDiv, terminalInput);
                
                // Salir del modo interactivo
                interactiveMode = false;
                currentInteractiveCommand = null;
                interactiveState = {};
                
                // Limpiar el input
                inputField.value = '';
                
                // Scroll al final
                terminalContent.scrollTop = terminalContent.scrollHeight;
            }
        }
    });

    // Hacer clic en la terminal para enfocar el input
    terminal.addEventListener('click', function() {
        inputField.focus();
    });

    // Enfocar el input al cargar
    inputField.focus();

    // Mostrar mensaje de bienvenida
    const welcomeDiv = document.createElement('div');
    welcomeDiv.className = 'command-output';
    welcomeDiv.textContent = `Bienvenido a Kitty Terminal
Escribe 'help' para ver los comandos disponibles.`;
    terminalContent.insertBefore(welcomeDiv, terminalInput);
});
