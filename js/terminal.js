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
            if (!args || args.length === 0) {
                return `Searching anime via Gogoanime...
Enter the anime name: _`;
            } else {
                const animeName = args.join(' ');
                return `Searching for "${animeName}"...
Found 5 results:
1. ${animeName} (TV)
2. ${animeName} Movie
3. ${animeName} OVA
4. ${animeName} Season 2
5. ${animeName} Special

Enter choice: 1

Loading episode list...
Found 12 episodes.

[1] Episode 1
[2] Episode 2
[3] Episode 3
...
[12] Episode 12

Enter episode number: _`;
            }
        },
        'pokemon-colorscripts': function(args) {
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
                }
            ];
            
            if (args && args.includes('-r')) {
                // Mostrar un Pokémon aleatorio
                const randomPokemon = pokemons[Math.floor(Math.random() * pokemons.length)];
                return `${randomPokemon.name}${randomPokemon.art}`;
            } else if (args && args.length > 0) {
                // Buscar un Pokémon específico
                const pokemonName = args[0].toLowerCase();
                const foundPokemon = pokemons.find(p => p.name.toLowerCase() === pokemonName);
                if (foundPokemon) {
                    return `${foundPokemon.name}${foundPokemon.art}`;
                } else {
                    return `Pokémon "${args[0]}" no encontrado.
Uso: pokemon-colorscripts [-r] [nombre]
  -r: Muestra un Pokémon aleatorio`;
                }
            } else {
                return `Uso: pokemon-colorscripts [-r] [nombre]
  -r: Muestra un Pokémon aleatorio`;
            }
        },
        'ls': function() {
            return `Desktop  Documents  Downloads  Music  Pictures  Videos`;
        },
        'cd': function(args) {
            if (!args || args.length === 0) {
                return ``;
            } else {
                return ``;
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

    // Función para procesar comandos
    function processCommand(commandText) {
        if (!commandText.trim()) return;
        
        // Agregar al historial
        commandHistory.push(commandText);
        historyIndex = commandHistory.length;
        
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
        if (commands[cmd]) {
            const output = commands[cmd](args);
            if (output !== null) {
                const outputDiv = document.createElement('div');
                outputDiv.className = 'command-output';
                outputDiv.textContent = output;
                terminalContent.insertBefore(outputDiv, terminalInput);
            }
        } else {
            const outputDiv = document.createElement('div');
            outputDiv.className = 'command-output';
            outputDiv.textContent = `${cmd}: comando no encontrado`;
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
            if (historyIndex > 0) {
                historyIndex--;
                inputField.value = commandHistory[historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                inputField.value = commandHistory[historyIndex];
            } else {
                historyIndex = commandHistory.length;
                inputField.value = '';
            }
        } else if (e.key === 'Tab') {
            e.preventDefault();
            // Autocompletar (simplificado)
            const input = inputField.value.trim();
            if (input) {
                const cmdPart = input.split(' ')[0];
                const matches = Object.keys(commands).filter(cmd => cmd.startsWith(cmdPart));
                if (matches.length === 1) {
                    inputField.value = matches[0] + (input.includes(' ') ? ' ' + input.split(' ').slice(1).join(' ') : ' ');
                }
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
