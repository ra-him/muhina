
/* =========================================================
   BIRTHDAY SURPRISE WEBSITE
   Created for: KAZI MUHINA ISLAM
   From: KAZI ABDUR RAHIM
   ========================================================= */


/* =========================================================
   1. CONFIGURATION
   এখান থেকে নিজের তথ্য পরিবর্তন করবে
   ========================================================= */

const CONFIG = {
    wifeName: "KAZI MUHINA ISLAM",
    husbandName: "KAZI ABDUR RAHIM",

    birthdayDate: "2026-11-19",
    birthdayTime: "01:51",

    timezone: "Asia/Dhaka",

    couplePhoto: "our-photo.jpg",
    backgroundMusic: "romantic-music.mp3",
    enableMusic: true,

    loveLetter: `প্রিয় KAZI MUHINA ISLAM,

শুভ জন্মদিন, আমার ভালোবাসা।

তুমি আমার জীবনের এমন একজন মানুষ,
যার উপস্থিতি আমার প্রতিটি দিনকে সুন্দর করে তোলে।

তোমার হাসি, তোমার অভিমান,
তোমার ছোট ছোট আবদার—
সবকিছুই আমার কাছে অনেক মূল্যবান।

জীবনের প্রতিটি মুহূর্তে তোমার পাশে থাকতে চাই।
তোমার সুখে হাসতে চাই,
তোমার দুঃখে হাত ধরে রাখতে চাই।

আল্লাহ তোমার জীবনকে সুখ, শান্তি,
সুস্থতা ও ভালোবাসায় ভরিয়ে দিন।

আজকের এই বিশেষ দিনে শুধু এটুকুই বলতে চাই—
তোমাকে অনেক ভালোবাসি।

ইতি,
তোমার KAZI ABDUR RAHIM ❤️`
};


/* =========================================================
   2. DOM ELEMENTS
   ========================================================= */

const $ = (selector) => document.querySelector(selector);

const countdownScreen = $("#countdown-screen");
const birthdayScreen = $("#birthday-screen");
const finalSurpriseScreen = $("#final-surprise");

const daysElement = $("#days");
const hoursElement = $("#hours");
const minutesElement = $("#minutes");
const secondsElement = $("#seconds");


/* =========================================================
   3. INITIAL SETUP
   ========================================================= */

function initializeWebsite() {

    // Wife and husband names
    document.querySelectorAll(".wife-name").forEach(element => {
        element.textContent = CONFIG.wifeName;
    });

    document.querySelectorAll(".husband-name").forEach(element => {
        element.textContent = CONFIG.husbandName;
    });

    // Couple photo
    document.querySelectorAll(".couple-photo").forEach(image => {
        image.src = CONFIG.couplePhoto;

        image.onerror = function () {
            this.style.display = "none";

            const fallback = document.createElement("div");
            fallback.className = "photo-fallback";
            fallback.textContent = "❤️ Our Beautiful Memories ❤️";

            this.parentElement.appendChild(fallback);
        };
    });

    // Love letter
    const letterElement = $("#love-letter-text");

    if (letterElement) {
        letterElement.textContent = "";
    }

    // Music
    setupMusic();

    // Determine which screen should appear
    checkBirthdayStatus();
}


/* =========================================================
   4. BIRTHDAY TARGET TIME
   Asia/Dhaka = UTC+6
   ========================================================= */

function getBirthdayTimestamp() {

    const date = CONFIG.birthdayDate;
    const time = CONFIG.birthdayTime;

    // Bangladesh UTC+6
    const birthdayDateTime = `${date}T${time}:00+06:00`;

    return new Date(birthdayDateTime).getTime();
}


/* =========================================================
   5. COUNTDOWN LOGIC
   ========================================================= */

let countdownInterval = null;
let birthdayStarted = false;

function updateCountdown() {

    const targetTime = getBirthdayTimestamp();
    const currentTime = Date.now();

    const distance = targetTime - currentTime;

    // Birthday time has arrived
    if (distance <= 0) {

        if (daysElement) daysElement.textContent = "00";
        if (hoursElement) hoursElement.textContent = "00";
        if (minutesElement) minutesElement.textContent = "00";
        if (secondsElement) secondsElement.textContent = "00";

        clearInterval(countdownInterval);

        startBirthdayCelebration();

        return;
    }

    const days = Math.floor(
        distance / (1000 * 60 * 60 * 24)
    );

    const hours = Math.floor(
        (distance / (1000 * 60 * 60)) % 24
    );

    const minutes = Math.floor(
        (distance / (1000 * 60)) % 60
    );

    const seconds = Math.floor(
        (distance / 1000) % 60
    );

    // Display countdown
    if (daysElement) {
        daysElement.textContent = String(days).padStart(2, "0");
    }

    if (hoursElement) {
        hoursElement.textContent = String(hours).padStart(2, "0");
    }

    if (minutesElement) {
        minutesElement.textContent = String(minutes).padStart(2, "0");
    }

    if (secondsElement) {
        secondsElement.textContent = String(seconds).padStart(2, "0");
    }
}


/* =========================================================
   6. CHECK BIRTHDAY STATUS
   ========================================================= */

function checkBirthdayStatus() {

    const targetTime = getBirthdayTimestamp();
    const currentTime = Date.now();

    if (currentTime >= targetTime) {

        // Birthday has already started
        startBirthdayCelebration();

    } else {

        // Birthday has not started yet
        showCountdownScreen();

        updateCountdown();

        countdownInterval = setInterval(
            updateCountdown,
            1000
        );
    }
}


/* =========================================================
   7. SCREEN MANAGEMENT
   ========================================================= */

function hideAllScreens() {

    [countdownScreen, birthdayScreen, finalSurpriseScreen]
        .forEach(screen => {

            if (screen) {
                screen.classList.remove("active");
            }

        });
}


function showCountdownScreen() {

    hideAllScreens();

    if (countdownScreen) {
        countdownScreen.classList.add("active");
    }
}


/* =========================================================
   8. START BIRTHDAY CELEBRATION
   ========================================================= */

function startBirthdayCelebration() {

    if (birthdayStarted) return;

    birthdayStarted = true;

    clearInterval(countdownInterval);

    hideAllScreens();

    if (birthdayScreen) {
        birthdayScreen.classList.add("active");
    }

    // Celebration animations
    launchConfetti();
}


/* =========================================================
   9. CAKE CANDLE BLOW
   ========================================================= */

const blowButton = $("#blow-candle");
const candle = $("#candle");
const flame = $("#flame");

if (blowButton) {

    blowButton.addEventListener("click", () => {

        if (flame) {
            flame.classList.add("blown-out");
        }

        if (candle) {
            candle.classList.add("candle-blown");
        }

        blowButton.textContent = "Make a Wish! ❤️";

        launchConfetti();

        blowButton.disabled = true;

    });

}


/* =========================================================
   10. ENVELOPE AND LOVE LETTER
   ========================================================= */

const envelope = $("#envelope");
const letterElement = $("#love-letter-text");

let letterTypingStarted = false;

if (envelope) {

    envelope.addEventListener("click", () => {

        envelope.classList.add("open");

        if (!letterTypingStarted) {

            letterTypingStarted = true;

            typeLoveLetter();

        }

    });

}


function typeLoveLetter() {

    if (!letterElement) return;

    const message = CONFIG.loveLetter;

    let index = 0;

    letterElement.textContent = "";

    function typeCharacter() {

        if (index < message.length) {

            letterElement.textContent += message.charAt(index);

            index++;

            setTimeout(typeCharacter, 45);

        }

    }

    typeCharacter();
}


/* =========================================================
   11. FINAL SURPRISE
   ========================================================= */

const surpriseButton = $("#surprise-button");

if (surpriseButton) {

    surpriseButton.addEventListener("click", () => {

        hideAllScreens();

        if (finalSurpriseScreen) {
            finalSurpriseScreen.classList.add("active");
        }

        launchConfetti();

        launchConfetti();

    });

}


/* =========================================================
   12. CONFETTI ANIMATION
   ========================================================= */

function launchConfetti() {

    if (typeof confetti === "function") {

        confetti({
            particleCount: 150,
            spread: 100,
            origin: {
                y: 0.6
            }
        });

    } else {

        // Fallback if canvas-confetti library is not loaded
        createSimpleConfetti();

    }

}


function createSimpleConfetti() {

    const colors = [
        "#ff4d88",
        "#ffd700",
        "#ff69b4",
        "#9b59b6",
        "#00cec9"
    ];

    for (let i = 0; i < 70; i++) {

        const piece = document.createElement("div");

        piece.className = "confetti-piece";

        piece.style.position = "fixed";
        piece.style.top = "-10px";
        piece.style.left = Math.random() * 100 + "vw";

        piece.style.width = "8px";
        piece.style.height = "12px";

        piece.style.backgroundColor =
            colors[Math.floor(Math.random() * colors.length)];

        piece.style.zIndex = "99999";
        piece.style.pointerEvents = "none";

        piece.style.animation =
            `confettiFall ${2 + Math.random() * 3}s linear forwards`;

        document.body.appendChild(piece);

        setTimeout(() => {
            piece.remove();
        }, 5500);

    }

}


/* =========================================================
   13. BACKGROUND MUSIC
   ========================================================= */

let backgroundAudio = null;

function setupMusic() {

    if (!CONFIG.enableMusic) return;

    backgroundAudio = new Audio(CONFIG.backgroundMusic);

    backgroundAudio.loop = true;
    backgroundAudio.volume = 0.5;

    const musicButton = $("#music-button");

    if (musicButton) {

        musicButton.addEventListener("click", () => {

            if (backgroundAudio.paused) {

                backgroundAudio.play()
                    .then(() => {
                        musicButton.textContent = "🔊 Music On";
                    })
                    .catch(error => {
                        console.error("Music playback failed:", error);
                    });

            } else {

                backgroundAudio.pause();

                musicButton.textContent = "🔇 Music Off";

            }

        });

    }

}


/* =========================================================
   14. REDUCED MOTION SUPPORT
   ========================================================= */

const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

if (prefersReducedMotion) {

    document.documentElement.classList.add("reduced-motion");

}


/* =========================================================
   15. CONFETTI CSS FALLBACK ANIMATION
   ========================================================= */

const confettiStyle = document.createElement("style");

confettiStyle.textContent = `
@keyframes confettiFall {
    0% {
        transform: translateY(-10px) rotate(0deg);
        opacity: 1;
    }

    100% {
        transform: translateY(110vh) rotate(720deg);
        opacity: 0;
    }
}

.reduced-motion *,
.reduced-motion *::before,
.reduced-motion *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
}
`;

document.head.appendChild(confettiStyle);


/* =========================================================
   16. INITIALIZE WEBSITE
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initializeWebsite();

});
