/**
 * ============================================
 * TOMBOL JANGAN DITEKAN - Game Web
 * ============================================
 * Fase 3: Random Surprises & Visual Effects
 * ============================================
 */

// ============================================
// CONSTANTS
// ============================================
const STORAGE_KEY = 'tombolJanganDitekan_count';

const MESSAGES = [
    'Coba aja kalau berani...',
    'Eh, jangan ditekan!',
    'Lu gak bisa berhenti ya?',
    'Gpp, lanjut aja...',
    'Hmm, mencurigakan...',
    'Udah berapa kali sih?',
    'Pengen terus ya?',
    'Ini baru permulaan loh...',
    'Gak bisa ditahan?',
    'Siapa suruh tekan?',
    'Sudah cukup belum?',
    'Keras kepala ya',
    'Lagi lagi lagi',
    'Gue kasih kesempatan deh',
    'Beneran gak bisa berhenti?',
    'Sanggup sampai berapa?',
    'Kamu pemberani',
    'Serius ini sih',
    'Gak ngerti peringatan?',
    'Percaya diri banget'
];

const SURPRISES = [
    // TEXT EFFECTS
    { type: 'text', value: 'BOO!', weight: 10 },
    { type: 'text', value: 'SURPRISE!', weight: 10 },
    { type: 'text', value: 'LU KENA!', weight: 10 },
    { type: 'text', value: 'JANGAN!', weight: 10 },
    { type: 'text', value: 'LAGI?', weight: 10 },
    { type: 'text', value: 'HEHEHE', weight: 10 },
    { type: 'text', value: 'SERIUS?', weight: 10 },
    { type: 'text', value: 'UDAH CUKUP?', weight: 10 },
    { type: 'text', value: 'GPP SIh...', weight: 10 },
    { type: 'text', value: 'KERAS KEPALA', weight: 10 },
    // EMOJI EFFECTS
    { type: 'emoji', value: '😂', weight: 10 },
    { type: 'emoji', value: '💀', weight: 10 },
    { type: 'emoji', value: '🔥', weight: 10 },
    { type: 'emoji', value: '👻', weight: 10 },
    { type: 'emoji', value: '🎉', weight: 10 },
    { type: 'emoji', value: '😈', weight: 10 },
    { type: 'emoji', value: '🤡', weight: 10 },
    { type: 'emoji', value: '🐸', weight: 10 },
    // SHAKE EFFECT
    { type: 'shake', weight: 3 },
    // FLASH EFFECT
    { type: 'flash', value: '#ff6b6b', weight: 2 },
    { type: 'flash', value: '#00ff00', weight: 2 },
    { type: 'flash', value: '#ffff00', weight: 2 }
];

const BRIGHT_COLORS = [
    '#FF6B6B', // Red
    '#4ECDC4', // Teal
    '#FFE66D', // Yellow
    '#95E1D3', // Mint
    '#FF8B94', // Pink
    '#A8E6CF', // Green
    '#FFD3B6', // Peach
    '#FFAAA5'  // Coral
];

// ============================================
// STATE
// ============================================
let clickCount = 0;
let audioContext = null;
let effectCount = 0;
const MAX_EFFECTS = 20;

// ============================================
// INITIALIZATION
// ============================================
/**
 * Inisialisasi game saat halaman dimuat
 * - Baca click count dari localStorage
 * - Setup audio context (lazy load)
 * - Attach event listeners
 */
function initGame() {
    // Baca dari localStorage
    const savedCount = localStorage.getItem(STORAGE_KEY);
    if (savedCount !== null) {
        clickCount = parseInt(savedCount, 10);
    }

    // Update tampilan
    updateCounterDisplay();

    // Attach event listeners
    const mainButton = document.getElementById('mainButton');
    if (mainButton) {
        mainButton.addEventListener('click', handleClick);
        // Initialize audio context on first user interaction
        mainButton.addEventListener('click', initAudioContext, { once: true });
    }

    console.log('Game ready. Current clicks:', clickCount);
}

// ============================================
// AUDIO CONTEXT INITIALIZATION
// ============================================
/**
 * Initialize Web Audio API context (lazy load)
 * Diperlukan untuk menghindari autoplay policy issues
 */
function initAudioContext() {
    if (audioContext === null) {
        try {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            audioContext = new AudioContextClass();
        } catch (e) {
            console.log('Web Audio API not supported');
        }
    }
}

// ============================================
// BUTTON CLICK HANDLER
// ============================================
/**
 * Handle tombol diklik
 * - Increment click count
 * - Update counter display
 * - Simpan ke localStorage
 * - Play sound effect
 * - Trigger surprise (60% chance)
 * - Update dynamic message (setiap 3 klik)
 */
function handleClick() {
    clickCount++;
    console.log('Clicked:', clickCount);

    // Update counter display
    updateCounterDisplay();

    // Simpan ke localStorage
    localStorage.setItem(STORAGE_KEY, clickCount.toString());

    // Play sound effect
    playClickSound();

    // Trigger surprise (60% chance)
    if (Math.random() < 0.6) {
        const surprise = pickRandomSurprise();
        triggerSurprise(surprise);
    }

    // Update dynamic message setiap 3 klik
    if (clickCount % 3 === 0) {
        setDynamicMessage(clickCount);
    }
}

// ============================================
// COUNTER DISPLAY UPDATE
// ============================================
/**
 * Update tampilan counter di DOM
 */
function updateCounterDisplay() {
    const clickCountElement = document.getElementById('clickCount');
    if (clickCountElement) {
        clickCountElement.textContent = clickCount;
    }
}

// ============================================
// DYNAMIC MESSAGE
// ============================================
/**
 * Set pesan dinamis berdasarkan click count
 * @param {number} count - Jumlah click saat ini
 */
function setDynamicMessage(count) {
    const messageElement = document.getElementById('dynamicMessage');
    if (messageElement) {
        // Pilih pesan random dari array
        const randomMessage = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
        messageElement.textContent = randomMessage;
    }
}

// ============================================
// WEIGHTED RANDOM SURPRISE PICKER
// ============================================
/**
 * Pilih surprise random dengan weighted probability
 * @returns {Object} Surprise object yang dipilih
 */
function pickRandomSurprise() {
    // Hitung total weight
    const totalWeight = SURPRISES.reduce((sum, surprise) => sum + surprise.weight, 0);

    // Random angka 0 - totalWeight
    let randomValue = Math.random() * totalWeight;

    // Loop dan kurangi weight sampai nemu
    for (let i = 0; i < SURPRISES.length; i++) {
        randomValue -= SURPRISES[i].weight;
        if (randomValue <= 0) {
            return SURPRISES[i];
        }
    }

    // Fallback (shouldn't happen)
    return SURPRISES[0];
}

// ============================================
// SURPRISE TRIGGER
// ============================================
/**
 * Trigger efek surprise berdasarkan type-nya
 * @param {Object} surprise - Object surprise dengan type dan value
 */
function triggerSurprise(surprise) {
    switch (surprise.type) {
        case 'text':
            spawnFloatingText(surprise.value);
            break;
        case 'emoji':
            spawnFloatingEmoji(surprise.value);
            break;
        case 'shake':
            triggerShake();
            break;
        case 'flash':
            triggerFlash(surprise.value);
            break;
    }
}

// ============================================
// FLOATING TEXT EFFECT
// ============================================
/**
 * Spawn teks yang melayang ke atas
 * @param {string} text - Text yang ditampilkan
 */
function spawnFloatingText(text) {
    // Check max effects
    if (effectCount >= MAX_EFFECTS) {
        cleanupOldestEffect();
    }

    const effectLayer = document.getElementById('effectLayer');
    if (!effectLayer) return;

    const floatingText = document.createElement('div');
    floatingText.className = 'floating-text';
    floatingText.textContent = text;

    // Random posisi
    const left = Math.random() * 80 + 10; // 10% - 90%
    const top = Math.random() * 40 + 30;  // 30% - 70%
    floatingText.style.left = left + '%';
    floatingText.style.top = top + '%';

    // Random warna cerah
    const randomColor = BRIGHT_COLORS[Math.floor(Math.random() * BRIGHT_COLORS.length)];
    floatingText.style.color = randomColor;

    effectLayer.appendChild(floatingText);
    effectCount++;

    // Remove setelah animasi selesai
    setTimeout(() => {
        floatingText.remove();
        effectCount--;
    }, 1500);
}

// ============================================
// FLOATING EMOJI EFFECT
// ============================================
/**
 * Spawn emoji yang melayang ke atas
 * Bisa spawn 3 emoji sekaligus
 * @param {string} emoji - Emoji yang ditampilkan
 */
function spawnFloatingEmoji(emoji) {
    const effectLayer = document.getElementById('effectLayer');
    if (!effectLayer) return;

    // Spawn 3 emoji dengan posisi random
    for (let i = 0; i < 3; i++) {
        // Check max effects
        if (effectCount >= MAX_EFFECTS) {
            cleanupOldestEffect();
        }

        const floatingEmoji = document.createElement('div');
        floatingEmoji.className = 'floating-emoji';
        floatingEmoji.textContent = emoji;

        // Random posisi
        const left = Math.random() * 80 + 10;  // 10% - 90%
        const top = Math.random() * 40 + 30;   // 30% - 70%
        floatingEmoji.style.left = left + '%';
        floatingEmoji.style.top = top + '%';

        // Random delay untuk tiap emoji
        floatingEmoji.style.animationDelay = (i * 0.15) + 's';

        effectLayer.appendChild(floatingEmoji);
        effectCount++;

        // Remove setelah animasi selesai
        setTimeout(() => {
            floatingEmoji.remove();
            effectCount--;
        }, 1500 + (i * 150));
    }
}

// ============================================
// SHAKE EFFECT
// ============================================
/**
 * Trigger screen shake animation
 */
function triggerShake() {
    const body = document.body;
    body.classList.add('shake');

    // Remove class setelah animasi selesai
    setTimeout(() => {
        body.classList.remove('shake');
    }, 300);
}

// ============================================
// FLASH EFFECT
// ============================================
/**
 * Trigger screen flash dengan warna tertentu
 * @param {string} color - Warna untuk flash effect
 */
function triggerFlash(color) {
    if (effectCount >= MAX_EFFECTS) {
        cleanupOldestEffect();
    }

    const effectLayer = document.getElementById('effectLayer');
    if (!effectLayer) return;

    const flashOverlay = document.createElement('div');
    flashOverlay.className = 'flash-overlay';
    flashOverlay.style.backgroundColor = color;

    effectLayer.appendChild(flashOverlay);
    effectCount++;

    // Remove setelah animasi selesai
    setTimeout(() => {
        flashOverlay.remove();
        effectCount--;
    }, 300);
}

// ============================================
// CLICK SOUND EFFECT
// ============================================
/**
 * Play beep sound menggunakan Web Audio API
 * Volume rendah, frequency random 200-800 Hz, duration 0.05s
 */
function playClickSound() {
    if (audioContext === null || audioContext.state === 'suspended') {
        return;
    }

    try {
        const now = audioContext.currentTime;
        const duration = 0.05;

        // Buat oscillator
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        // Random frequency 200-800 Hz
        const randomFrequency = Math.random() * 600 + 200;
        oscillator.frequency.setValueAtTime(randomFrequency, now);
        oscillator.type = 'sine';

        // Set volume (low)
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);

        // Connect dan start
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.start(now);
        oscillator.stop(now + duration);
    } catch (e) {
        console.log('Sound playback error:', e);
    }
}

// ============================================
// EFFECT CLEANUP
// ============================================
/**
 * Hapus efek tertua dari DOM jika sudah terlalu banyak
 * Buat ngakali performa
 */
function cleanupOldestEffect() {
    const effectLayer = document.getElementById('effectLayer');
    if (effectLayer && effectLayer.firstChild) {
        const oldestEffect = effectLayer.firstChild;
        if (oldestEffect) {
            oldestEffect.remove();
            effectCount = Math.max(0, effectCount - 1);
        }
    }
}

// ============================================
// MAIN EXECUTION
// ============================================
// Jalankan game saat DOM selesai loading
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame);
} else {
    initGame();
}