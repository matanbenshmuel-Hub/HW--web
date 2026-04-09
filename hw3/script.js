/**
 * Jungle Project
 * Author: Matan Ben Shmuel
 */

// Selecting DOM elements
const bgMusic = document.getElementById('bg-music');
const toggleBtn = document.getElementById('music-toggle');
const toggleIcon = document.getElementById('toggle-icon');
const toggleText = document.getElementById('toggle-text');

// State management variables
let isBackgroundMusicEnabled = true; 
let isAnimalPlaying = false; 
let hasStarted = false; // Tracks if the user has performed the first interaction

/**
 * Updates the visual state of the music control button
 * Changes the icon, text, and background color based on the music state
 */
function updateToggleButton() {
    if (isBackgroundMusicEnabled) {
        toggleIcon.innerText = "🔊";
        toggleText.innerText = "Music: ON (M)";
        toggleBtn.style.backgroundColor = "#e91e63";
    } else {
        toggleIcon.innerText = "🔇";
        toggleText.innerText = "Music: OFF (M)";
        toggleBtn.style.backgroundColor = "#555";
    }
}

/**
 * Toggles the background music on and off
 * Also updates the 'hasStarted' flag as a user interaction
 */
function toggleMusic() {
    hasStarted = true; // Button click counts as a user interaction
    isBackgroundMusicEnabled = !isBackgroundMusicEnabled;
    
    if (isBackgroundMusicEnabled && !isAnimalPlaying) {
        bgMusic.play();
    } else {
        bgMusic.pause();
    }
    updateToggleButton();
}

/**
 * Global click listener to start background music
 * Browser policies prevent autoplay until the user interacts with the page
 */
window.addEventListener('click', () => {
    // If this is the first interaction (and no animal was clicked yet)
    if (!hasStarted) {
        hasStarted = true;
        if (isBackgroundMusicEnabled && !isAnimalPlaying) {
            bgMusic.volume = 0.2;
            bgMusic.play().catch(() => {});
        }
    }
});

// Listener for the music toggle button
toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevents the event from bubbling up to the window listener
    toggleMusic();
});

/**
 * Plays a specific animal sound
 * @param {string} animalId - The ID of the animal to play
 */
function playAnimal(animalId) {
    hasStarted = true; // Marks first interaction to resolve autoplay blocking

    const animalAudio = document.getElementById(`audio-${animalId}`);
    
    if (animalAudio) {
        isAnimalPlaying = true;
        bgMusic.pause(); // Pause background music during animal sound

        animalAudio.currentTime = 0; // Reset sound to beginning
        animalAudio.play();

        // Resume background music only after the animal sound ends
        animalAudio.onended = () => { //= function() {
            isAnimalPlaying = false;
            if (isBackgroundMusicEnabled) {
                bgMusic.volume = 0.2;
                bgMusic.play();
            }
        };
    }
}

/**
 * Keyboard event listener
 * Handles 'M' for music toggle and specific keys for animal sounds
 */
window.addEventListener('keydown', (e) => {
    hasStarted = true; // Keyboard input counts as a user interaction
    const key = e.key.toLowerCase();
    
    // Toggle background music using the 'M' key
    if (key === 'm') {
        toggleMusic();
        return;
    }

    /* Mapping keys to animal IDs
     --- SPECIAL ELEMENT: Object Mapping (keyMap) ---
         This object maps keyboard keys to animal IDs. 
         It allows us to avoid repetitive 'if' or 'switch' statements,
         making the code much cleaner and easier to maintain.*/
    const keyMap = {
        'd': 'donkey',
        'c': 'cow',
        'g': 'dog', 
        'l': 'dolphin',
        'h': 'horse', 
        's': 'seagull', 
        'n': 'snake'
    };

    if (keyMap[key]) {
        playAnimal(keyMap[key]);
    } else {
        // Warning for unassigned keys
        alert("Invalid key! Please use the letters shown on the animals.");
    }
});