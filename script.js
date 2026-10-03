/**
 * ============================================
 * TOMBOL JANGAN DITEKAN - Game Web
 * ============================================
 * Fase 2: Main Button, Click Counter & localStorage
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
    'Siapa suruh tekan?'
];

// ============================================
// STATE
// ============================================
let clickCount = 0;
let messageChangeInterval = 0;

// ============================================
// INITIALIZATION
// ============================================
/**
 * Inisialisasi game saat halaman dimuat
 * - Baca click count dari localStorage
 * - Update tampilan counter
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
    }

    console.log('Game ready. Current clicks:', clickCount);
}

// ============================================
// BUTTON CLICK HANDLER
// ============================================
/**
 * Handle tombol diklik
 * - Increment click count
 * - Update counter display
 * - Simpan ke localStorage
 * - Update dynamic message (setiap 5 klik)
 */
function handleClick() {
    clickCount++;
    console.log('Clicked:', clickCount);

    // Update counter display
    updateCounterDisplay();

    // Simpan ke localStorage
    localStorage.setItem(STORAGE_KEY, clickCount.toString());

    // Update dynamic message setiap 5 klik
    if (clickCount % 5 === 0) {
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
// MAIN EXECUTION
// ============================================
// Jalankan game saat DOM selesai loading
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame);
} else {
    initGame();
}