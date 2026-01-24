// ============================================================================
// CONSTANTS
// ============================================================================

// Scoring range sizes (percentage width from center/edges)
const RANGE_SIZES = {
    blue: 3,    // Blue range: ±3% from center (6% total width)
    red: 4,     // Red range: ±4% from blue edges (8% total width each)
    yellow: 4   // Yellow range: ±4% from red edges (8% total width each)
};

// Scoring points per range
const RANGE_POINTS = {
    blue: 5,
    red: 4,
    yellow: 3
};

// Range colors for SVG drawing
const RANGE_COLORS = {
    blue: '#4dabf7',
    red: '#ff6b6b',
    yellow: '#ffd43b'
};

// Indicator rotation constants (semicircle: 0% = -90deg, 50% = 0deg, 100% = 90deg)
const ROTATION_OFFSET = -90;
const ROTATION_MULTIPLIER = 1.8;

// Scoring range center bounds
const CENTER_MIN = 0;
const CENTER_MAX = 100;

// Edge bias parameter (0.0 = uniform distribution, 1.0 = maximum bias toward edges)
// Higher values increase the chance of ranges near 0% or 100%
const EDGE_BIAS = 0.1; // Range: 0.0 to 1.0

// SVG drawing constants
const BAND_THICKNESS_RATIO = 0.12; // 12% of radius for band visibility

// ============================================================================
// GAME STATE
// ============================================================================

let gameState = {
    numTeams: 2,
    pointsToWin: 10,
    noPointLimit: false,
    teamNames: [],
    scores: [],
    currentTeam: 0,
    currentCategory: null,
    guessPosition: 50,
    categories: [],
    usedCategoryIndices: [],
    language: 'eng' // Default language
};

let currentScoringRanges = {
    blue: { min: 0, max: 0, points: RANGE_POINTS.blue },
    red: [],
    yellow: []
};

// ============================================================================
// DOM ELEMENTS
// ============================================================================

const elements = {
    setupScreen: document.getElementById('setup-screen'),
    gameScreen: document.getElementById('game-screen'),
    gameOverScreen: document.getElementById('game-over-screen'),
    scoreBoard: document.getElementById('score-board'),
    currentTeamText: document.getElementById('current-team-text'),
    categoryLeft: document.getElementById('category-left'),
    categoryRight: document.getElementById('category-right'),
    categoryLeftGuess: document.getElementById('category-left-guess'),
    categoryRightGuess: document.getElementById('category-right-guess'),
    categoryLeftResult: document.getElementById('category-left-result'),
    categoryRightResult: document.getElementById('category-right-result'),
    guessIndicator: document.getElementById('guess-indicator'),
    resultGuessIndicator: document.getElementById('result-guess-indicator'),
    clueGiverView: document.getElementById('clue-giver-view'),
    guessingView: document.getElementById('guessing-view'),
    resultsView: document.getElementById('results-view'),
    guessTrack: document.getElementById('guess-track'),
    distanceText: document.getElementById('distance-text'),
    pointsText: document.getElementById('points-text'),
    winnerText: document.getElementById('winner-text'),
    finalScoreText: document.getElementById('final-score-text'),
    languageSelect: document.getElementById('language-select')
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Clamp a value between min and max
 */
function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

/**
 * Convert percentage (0-100) to rotation angle in degrees
 */
function percentToRotation(percent) {
    return ROTATION_OFFSET + (percent * ROTATION_MULTIPLIER);
}

/**
 * Convert percentage (0-100) to angle in radians for semicircle
 * 0% = 180° (left), 50% = 90° (up), 100% = 0° (right)
 */
function percentToAngle(percent) {
    return Math.PI - (percent / 100 * Math.PI);
}

/**
 * Calculate point on semicircle arc
 */
function arcPoint(angle, radius, centerX, centerY) {
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY - Math.sin(angle) * radius;
    return { x, y };
}

// ============================================================================
// CATEGORY MANAGEMENT
// ============================================================================

/**
 * Parse categories from text content
 */
function parseCategoriesFromText(text) {
    const lines = text.split('\n')
        .map(line => line.trim())
        .filter(line => line !== '' && !line.startsWith('#'));
    
    return lines
        .map(line => {
            const parts = line.split(',').map(part => part.trim());
            return parts.length === 2 ? { left: parts[0], right: parts[1] } : null;
        })
        .filter(category => category !== null);
}

/**
 * Load categories from a single file
 */
async function loadCategoriesFromFile(language, filename) {
    const filepath = `categories/${language}/${filename}`;
    try {
        const response = await fetch(filepath);
        if (!response.ok) {
            return [];
        }
        const text = await response.text();
        const categories = parseCategoriesFromText(text);
        console.log(`Loaded ${categories.length} categories from ${filepath}`);
        return categories;
    } catch (error) {
        console.warn(`Failed to load ${filepath}:`, error);
        return [];
    }
}

/**
 * Try to discover category files by attempting common patterns
 * Note: For better performance, create a categories-manifest.txt file
 * listing all your category files instead of relying on discovery
 */
async function discoverCategoryFiles(language) {
    const files = [];
    
    // Try common patterns with underscores: categories_basic.txt, categories_funny.txt, etc.
    const commonNames = [
        'categories_basic.txt',
        'categories_funny.txt',
        'categories_geography.txt',
        'categories_interesting.txt',
        'categories_nsfw.txt',
        'categories_main.txt',
        'categories_extra.txt',
        'categories_additional.txt',
        'categories_new.txt',
        'categories_old.txt',
        'categories_custom.txt'
    ];
    files.push(...commonNames);
    
    // Try numbered patterns: categories1.txt through categories20.txt
    for (let i = 1; i <= 20; i++) {
        files.push(`categories${i}.txt`);
    }
    
    // Try underscore patterns: categories_1.txt through categories_20.txt
    for (let i = 1; i <= 20; i++) {
        files.push(`categories_${i}.txt`);
    }
    
    // Try dash patterns: categories-1.txt through categories-20.txt
    for (let i = 1; i <= 20; i++) {
        files.push(`categories-${i}.txt`);
    }
    
    return files;
}

/**
 * Load categories from manifest file (if it exists)
 */
async function loadCategoryManifest(language) {
    try {
        const filepath = `categories/${language}/categories-manifest.txt`;
        const response = await fetch(filepath);
        if (!response.ok) {
            return null;
        }
        const text = await response.text();
        const files = text.split('\n')
            .map(line => line.trim())
            .filter(line => line !== '' && !line.startsWith('#') && line.endsWith('.txt'));
        return files;
    } catch (error) {
        return null;
    }
}

// ============================================================================
// LANGUAGE CONFIGURATION
// ============================================================================

// Static list of supported languages
const SUPPORTED_LANGUAGES = [
    { code: 'eng', name: 'English' }
    // Add more languages here as needed:
    // { code: 'es', name: 'Español' },
    // { code: 'fr', name: 'Français' },
    // { code: 'de', name: 'Deutsch' },
];

/**
 * Populate language selector dropdown
 */
function populateLanguageSelector() {
    const select = elements.languageSelect;
    
    select.innerHTML = '';
    SUPPORTED_LANGUAGES.forEach(lang => {
        const option = document.createElement('option');
        option.value = lang.code;
        option.textContent = lang.name;
        if (lang.code === gameState.language) {
            option.selected = true;
        }
        select.appendChild(option);
    });
    
    // Update game state when language changes
    select.addEventListener('change', (e) => {
        gameState.language = e.target.value;
        loadCategories();
    });
}

/**
 * Load all categories from multiple files for the selected language
 */
async function loadCategories() {
    const language = gameState.language || 'eng';
    gameState.categories = [];
    
    // First, try to load from manifest file
    const manifestFiles = await loadCategoryManifest(language);
    let filesToTry = [];
    
    if (manifestFiles && manifestFiles.length > 0) {
        // Use manifest if available
        filesToTry = manifestFiles;
        console.log(`Using manifest file for ${language}, loading:`, filesToTry);
    } else {
        // Otherwise, try to discover files
        filesToTry = await discoverCategoryFiles(language);
        console.log(`No manifest found for ${language}, trying to discover files:`, filesToTry.slice(0, 5), '...');
    }
    
    // Load all files in parallel
    const loadPromises = filesToTry.map(filename => loadCategoriesFromFile(language, filename));
    const results = await Promise.all(loadPromises);
    
    // Merge all categories
    results.forEach((categories) => {
        if (categories.length > 0) {
            gameState.categories.push(...categories);
        }
    });
    
    // Remove duplicates (same left and right)
    const seen = new Set();
    gameState.categories = gameState.categories.filter(category => {
        const key = `${category.left}|${category.right}`;
        if (seen.has(key)) {
            return false;
        }
        seen.add(key);
        return true;
    });
    
    if (gameState.categories.length === 0) {
        console.warn(`No categories loaded for ${language}, using fallback`);
        // Fallback categories
        gameState.categories = [
            { left: "Wet", right: "Dry" },
            { left: "Hot", right: "Cold" },
            { left: "Good", right: "Evil" }
        ];
    }
    
    console.log(`Total categories loaded for ${language}: ${gameState.categories.length}`);
}

/**
 * Get a random unused category, resetting if all are used
 */
function selectRandomCategory() {
    const availableIndices = gameState.categories
        .map((_, index) => index)
        .filter(index => !gameState.usedCategoryIndices.includes(index));
    
    let selectedIndex;
    if (availableIndices.length === 0) {
        // All categories used, reset and allow repeats
        gameState.usedCategoryIndices = [];
        selectedIndex = Math.floor(Math.random() * gameState.categories.length);
    } else {
        selectedIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    }
    
    gameState.usedCategoryIndices.push(selectedIndex);
    return gameState.categories[selectedIndex];
}

/**
 * Update category text in all views
 */
function updateCategoryDisplay(category) {
    elements.categoryLeft.textContent = category.left;
    elements.categoryRight.textContent = category.right;
    elements.categoryLeftGuess.textContent = category.left;
    elements.categoryRightGuess.textContent = category.right;
    elements.categoryLeftResult.textContent = category.left;
    elements.categoryRightResult.textContent = category.right;
}

// ============================================================================
// SCORING RANGE CALCULATION
// ============================================================================

/**
 * Create a scoring range with bounds checking
 */
function createRange(min, max, points) {
    const clampedMin = clamp(min, 0, 100);
    const clampedMax = clamp(max, 0, 100);
    return clampedMax > clampedMin ? { min: clampedMin, max: clampedMax, points } : null;
}

/**
 * Calculate scoring ranges based on center position
 */
function calculateScoringRanges(centerPercent) {
    // Blue range (5 points) - centered at random position
    const blueMin = clamp(centerPercent - RANGE_SIZES.blue, 0, 100);
    const blueMax = clamp(centerPercent + RANGE_SIZES.blue, 0, 100);
    
    // Red ranges (4 points) - on both sides of blue
    const redRanges = [
        createRange(blueMin - RANGE_SIZES.red, blueMin, RANGE_POINTS.red),
        createRange(blueMax, blueMax + RANGE_SIZES.red, RANGE_POINTS.red)
    ].filter(range => range !== null);
    
    // Yellow ranges (3 points) - on both sides of red
    // Calculate based on blue boundaries, not red ranges, so yellow can exist even if red is null
    const yellowRanges = [
        createRange(blueMin - RANGE_SIZES.red - RANGE_SIZES.yellow, blueMin - RANGE_SIZES.red, RANGE_POINTS.yellow),
        createRange(blueMax + RANGE_SIZES.red, blueMax + RANGE_SIZES.red + RANGE_SIZES.yellow, RANGE_POINTS.yellow)
    ].filter(range => range !== null);
    
    currentScoringRanges = {
        blue: { min: blueMin, max: blueMax, points: RANGE_POINTS.blue },
        red: redRanges.filter(r => r !== null),
        yellow: yellowRanges.filter(r => r !== null)
    };
}

// ============================================================================
// SCORING
// ============================================================================

/**
 * Calculate points based on which range the guess falls into
 */
function calculatePoints() {
    const guess = gameState.guessPosition;
    
    // Check ranges in priority order (blue > red > yellow)
    if (guess >= currentScoringRanges.blue.min && guess <= currentScoringRanges.blue.max) {
        return { points: RANGE_POINTS.blue, rangeName: 'blue' };
    }
    
    const inRedRange = currentScoringRanges.red.some(range => 
        guess >= range.min && guess <= range.max
    );
    if (inRedRange) {
        return { points: RANGE_POINTS.red, rangeName: 'red' };
    }
    
    const inYellowRange = currentScoringRanges.yellow.some(range => 
        guess >= range.min && guess <= range.max
    );
    if (inYellowRange) {
        return { points: RANGE_POINTS.yellow, rangeName: 'yellow' };
    }
    
    return { points: 0, rangeName: 'none' };
}

/**
 * Get display text for range name
 */
function getRangeText(rangeName) {
    const texts = {
        blue: 'Blue Range (5 pts)',
        red: 'Red Range (4 pts)',
        yellow: 'Yellow Range (3 pts)',
        none: 'Outside Range'
    };
    return texts[rangeName] || texts.none;
}

// ============================================================================
// SVG DRAWING
// ============================================================================

/**
 * Create SVG arc path for a scoring range
 */
function createArcPath(startPercent, endPercent, radius, centerX, centerY) {
    const clampedStart = clamp(startPercent, 0, 100);
    const clampedEnd = clamp(endPercent, 0, 100);
    
    if (clampedStart >= clampedEnd) return '';
    
    const startAngle = percentToAngle(clampedStart);
    const endAngle = percentToAngle(clampedEnd);
    
    const outerStart = arcPoint(startAngle, radius, centerX, centerY);
    const outerEnd = arcPoint(endAngle, radius, centerX, centerY);
    
    const innerRadius = Math.max(0, radius * (1 - BAND_THICKNESS_RATIO));
    const innerStart = arcPoint(startAngle, innerRadius, centerX, centerY);
    const innerEnd = arcPoint(endAngle, innerRadius, centerX, centerY);
    
    const largeArc = (endAngle - startAngle) > Math.PI ? 1 : 0;
    
    return `M ${outerStart.x} ${outerStart.y} A ${radius} ${radius} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y} L ${innerEnd.x} ${innerEnd.y} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y} Z`;
}

/**
 * Create and configure SVG element
 */
function createSVG(trackWidth, trackHeight) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', trackWidth.toString());
    svg.setAttribute('height', trackHeight.toString());
    svg.setAttribute('viewBox', `0 0 ${trackWidth} ${trackHeight}`);
    Object.assign(svg.style, {
        position: 'absolute',
        top: '0px',
        left: '0px',
        width: trackWidth + 'px',
        height: trackHeight + 'px',
        pointerEvents: 'none',
        overflow: 'hidden'
    });
    return svg;
}

/**
 * Draw a single range as an SVG path
 */
function drawRange(svg, range, color, opacity, trackWidth, trackHeight) {
    if (!range) return;
    
    const radius = trackHeight;
    const centerX = trackWidth / 2;
    const centerY = trackHeight;
    
    const pathData = createArcPath(range.min, range.max, radius, centerX, centerY);
    if (!pathData) return;
    
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathData);
    path.setAttribute('fill', color);
    path.setAttribute('opacity', opacity.toString());
    svg.appendChild(path);
}

/**
 * Draw all scoring ranges on a track
 */
function drawScoringRanges(trackId, zonesId) {
    const scoringZones = document.getElementById(zonesId);
    const track = document.getElementById(trackId);
    if (!scoringZones || !track) return;
    
    scoringZones.innerHTML = '';
    
    const trackWidth = track.offsetWidth;
    const trackHeight = track.offsetHeight;
    const svg = createSVG(trackWidth, trackHeight);
    
    // Draw ranges in order (yellow, red, blue) so blue appears on top
    currentScoringRanges.yellow.forEach(range => {
        drawRange(svg, range, RANGE_COLORS.yellow, 0.5, trackWidth, trackHeight);
    });
    
    currentScoringRanges.red.forEach(range => {
        drawRange(svg, range, RANGE_COLORS.red, 0.5, trackWidth, trackHeight);
    });
    
    drawRange(svg, currentScoringRanges.blue, RANGE_COLORS.blue, 0.6, trackWidth, trackHeight);
    
    scoringZones.style.width = trackWidth + 'px';
    scoringZones.style.height = trackHeight + 'px';
    scoringZones.appendChild(svg);
}

// ============================================================================
// UI UPDATES
// ============================================================================

/**
 * Get team name or default to "Team X"
 */
function getTeamName(index) {
    return gameState.teamNames[index] || `Team ${index + 1}`;
}

/**
 * Update score board display
 */
function updateScoreBoard() {
    elements.scoreBoard.innerHTML = '';
    gameState.scores.forEach((score, index) => {
        const scoreItem = document.createElement('div');
        scoreItem.className = 'score-item';
        scoreItem.innerHTML = `
            <span class="team-name">${getTeamName(index)}</span>
            <span class="team-score">${score}</span>
        `;
        elements.scoreBoard.appendChild(scoreItem);
    });
}

/**
 * Show a specific screen
 */
function showScreen(screenId) {
    elements.setupScreen.classList.remove('active');
    elements.gameScreen.classList.remove('active');
    elements.gameOverScreen.classList.remove('active');
    document.getElementById(screenId).classList.add('active');
}

/**
 * Show a specific game view
 */
function showView(viewName) {
    elements.clueGiverView.classList.toggle('hidden', viewName !== 'clue-giver');
    elements.guessingView.classList.toggle('hidden', viewName !== 'guessing');
    elements.resultsView.classList.toggle('hidden', viewName !== 'results');
}

/**
 * Update guess indicator rotation
 */
function updateGuessIndicator() {
    if (!elements.guessIndicator) return;
    const rotation = percentToRotation(gameState.guessPosition);
    elements.guessIndicator.style.transform = `translateX(-50%) rotate(${rotation}deg)`;
}

// ============================================================================
// DRAGGING LOGIC
// ============================================================================

let isDragging = false;
let draggingHandlers = null;

/**
 * Update indicator position from mouse/touch event
 */
function updatePositionFromEvent(e) {
    if (!elements.guessTrack || !e || !elements.guessIndicator) return;
    
    const rect = elements.guessTrack.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const clampedX = clamp(mouseX, 0, rect.width);
    const percentage = (clampedX / rect.width) * 100;
    
    gameState.guessPosition = percentage;
    updateGuessIndicator();
}

function startDragging(e) {
    if (!elements.guessTrack || !elements.guessIndicator) return;
    isDragging = true;
    elements.guessIndicator.style.transition = 'none';
    updatePositionFromEvent(e);
    if (e.preventDefault) e.preventDefault();
    if (e.stopPropagation) e.stopPropagation();
}

function stopDragging() {
    isDragging = false;
    if (elements.guessIndicator) {
        elements.guessIndicator.style.transition = '';
    }
}

/**
 * Setup dragging event handlers
 */
function setupDragging() {
    if (!elements.guessTrack || !elements.guessIndicator) return;
    
    // Remove old handlers
    if (draggingHandlers) {
        const handlers = draggingHandlers;
        elements.guessTrack.removeEventListener('mousedown', handlers.handleMouseDown);
        elements.guessIndicator.removeEventListener('mousedown', handlers.handleMouseDown);
        elements.guessTrack.removeEventListener('click', handlers.handleClick);
        document.removeEventListener('mousemove', handlers.handleMouseMove);
        document.removeEventListener('mouseup', handlers.handleMouseUp);
        elements.guessTrack.removeEventListener('touchstart', handlers.handleTouchStart);
        elements.guessIndicator.removeEventListener('touchstart', handlers.handleTouchStart);
        document.removeEventListener('touchmove', handlers.handleTouchMove);
        document.removeEventListener('touchend', handlers.handleTouchEnd);
    }
    
    // Create new handlers
    draggingHandlers = {
        handleMouseDown: (e) => startDragging(e),
        handleClick: (e) => { if (!isDragging) updatePositionFromEvent(e); },
        handleMouseMove: (e) => { if (isDragging) updatePositionFromEvent(e); },
        handleMouseUp: () => stopDragging(),
        handleTouchStart: (e) => { startDragging(e.touches[0]); e.preventDefault(); },
        handleTouchMove: (e) => { if (isDragging) { updatePositionFromEvent(e.touches[0]); e.preventDefault(); } },
        handleTouchEnd: () => stopDragging()
    };
    
    // Add event listeners
    const h = draggingHandlers;
    elements.guessTrack.addEventListener('mousedown', h.handleMouseDown);
    elements.guessIndicator.addEventListener('mousedown', h.handleMouseDown);
    elements.guessTrack.addEventListener('click', h.handleClick);
    document.addEventListener('mousemove', h.handleMouseMove);
    document.addEventListener('mouseup', h.handleMouseUp);
    elements.guessTrack.addEventListener('touchstart', h.handleTouchStart);
    elements.guessIndicator.addEventListener('touchstart', h.handleTouchStart);
    document.addEventListener('touchmove', h.handleTouchMove);
    document.addEventListener('touchend', h.handleTouchEnd);
}

// ============================================================================
// GAME FLOW
// ============================================================================

/**
 * Update team name inputs when number of teams changes
 */
function updateTeamNameInputs() {
    const numTeams = parseInt(document.getElementById('num-teams').value);
    const container = document.getElementById('team-names-container');
    container.innerHTML = '';
    
    for (let i = 0; i < numTeams; i++) {
        const inputGroup = document.createElement('div');
        inputGroup.className = 'team-name-input-group';
        inputGroup.innerHTML = `
            <label for="team-name-${i}">Team ${i + 1} Name</label>
            <input type="text" id="team-name-${i}" class="setup-input" 
                   placeholder="Team ${i + 1}" 
                   value="${gameState.teamNames[i] || ''}">
        `;
        container.appendChild(inputGroup);
    }
}

/**
 * Collect team names from inputs
 */
function collectTeamNames() {
    const numTeams = parseInt(document.getElementById('num-teams').value);
    gameState.teamNames = [];
    for (let i = 0; i < numTeams; i++) {
        const input = document.getElementById(`team-name-${i}`);
        const name = input ? input.value.trim() : '';
        gameState.teamNames.push(name || `Team ${i + 1}`);
    }
}

/**
 * Initialize game
 */
function initGame() {
    gameState.numTeams = parseInt(document.getElementById('num-teams').value);
    gameState.noPointLimit = document.getElementById('no-point-limit').checked;
    gameState.pointsToWin = gameState.noPointLimit ? Infinity : parseInt(document.getElementById('points-to-win').value);
    gameState.language = elements.languageSelect.value || 'eng';
    
    collectTeamNames();
    
    gameState.scores = new Array(gameState.numTeams).fill(0);
    gameState.currentTeam = 0;
    gameState.usedCategoryIndices = [];
    
    // Reload categories with selected language
    loadCategories().then(() => {
        updateScoreBoard();
        startNewRound();
        showScreen('game-screen');
    });
}

/**
 * Generate a random center position with edge bias
 * Higher EDGE_BIAS values favor positions near 0% or 100%
 */
function generateRandomCenter() {
    if (EDGE_BIAS === 0) {
        // Uniform distribution across full range
        return CENTER_MIN + Math.random() * (CENTER_MAX - CENTER_MIN);
    }
    
    // Use a power function to bias toward edges
    // When EDGE_BIAS is high, we're more likely to get values near 0 or 100
    const normalizedRandom = Math.pow(Math.random(), 1 / (1 + EDGE_BIAS));
    
    // Map to either lower half (0-50%) or upper half (50-100%) with equal probability
    const useLowerHalf = Math.random() < 0.5;
    
    if (useLowerHalf) {
        // Lower half: map from 50% toward 0%
        // normalizedRandom of 0 = 50%, normalizedRandom of 1 = 0%
        return 50 * (1 - normalizedRandom);
    } else {
        // Upper half: map from 50% toward 100%
        // normalizedRandom of 0 = 50%, normalizedRandom of 1 = 100%
        return 50 + 50 * normalizedRandom;
    }
}

/**
 * Start a new round
 */
function startNewRound() {
    gameState.currentCategory = selectRandomCategory();
    updateCategoryDisplay(gameState.currentCategory);
    
    const randomCenter = generateRandomCenter();
    calculateScoringRanges(randomCenter);
    
    gameState.guessPosition = 50;
    elements.currentTeamText.textContent = `${getTeamName(gameState.currentTeam)}'s Turn`;
    
    showView('clue-giver');
    
    setTimeout(() => {
        drawScoringRanges('clue-giver-track', 'clue-giver-zones');
    }, 10);
}

/**
 * Hide indicator and show guessing view
 */
function hideIndicator() {
    showView('guessing');
    gameState.guessPosition = 50;
    updateGuessIndicator();
    
    const guessZones = document.getElementById('guess-zones');
    if (guessZones) {
        guessZones.innerHTML = '';
    }
    
    setTimeout(() => setupDragging(), 50);
}

/**
 * Show results
 */
function showResults() {
    const { points, rangeName } = calculatePoints();
    
    gameState.scores[gameState.currentTeam] += points;
    
    elements.distanceText.textContent = `Range Hit: ${getRangeText(rangeName)}`;
    elements.pointsText.textContent = `Points Earned: ${points}`;
    
    showView('results');
    
    setTimeout(() => {
        drawScoringRanges('result-track', 'scoring-zones');
        const rotation = percentToRotation(gameState.guessPosition);
        elements.resultGuessIndicator.style.transform = `translateX(-50%) rotate(${rotation}deg)`;
    }, 10);
    
    updateScoreBoard();
    
    // Check for game over (only if point limit is enabled)
    if (!gameState.noPointLimit && gameState.scores[gameState.currentTeam] >= gameState.pointsToWin) {
        setTimeout(() => showGameOver(), 2000);
    }
}

/**
 * Move to next team
 */
function nextTeam() {
    gameState.currentTeam = (gameState.currentTeam + 1) % gameState.numTeams;
    startNewRound();
}

/**
 * Show game over screen
 */
function showGameOver() {
    const winningTeam = gameState.scores.indexOf(Math.max(...gameState.scores));
    elements.winnerText.textContent = `${getTeamName(winningTeam)} Wins!`;
    elements.finalScoreText.textContent = `Final Score: ${gameState.scores[winningTeam]} points`;
    showScreen('game-over-screen');
}

// ============================================================================
// INITIALIZATION
// ============================================================================

// Setup dragging when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupDragging);
} else {
    setupDragging();
}

// Event listeners
document.getElementById('start-game-btn').addEventListener('click', initGame);
document.getElementById('hide-indicator-btn').addEventListener('click', hideIndicator);
document.getElementById('done-guessing-btn').addEventListener('click', showResults);
document.getElementById('next-round-btn').addEventListener('click', nextTeam);
document.getElementById('play-again-btn').addEventListener('click', () => {
    showScreen('setup-screen');
});

// Update team name inputs when number of teams changes
document.getElementById('num-teams').addEventListener('change', updateTeamNameInputs);

// Disable/enable points input based on no-point-limit checkbox
document.getElementById('no-point-limit').addEventListener('change', (e) => {
    const pointsInput = document.getElementById('points-to-win');
    pointsInput.disabled = e.target.checked;
    if (e.target.checked) {
        pointsInput.style.opacity = '0.5';
    } else {
        pointsInput.style.opacity = '1';
    }
});

// Initialize on page load
populateLanguageSelector();
updateTeamNameInputs();
loadCategories().then(() => {
    console.log('Categories loaded:', gameState.categories.length);
});
