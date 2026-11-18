/* Edit this object to personalize the whole experience. */
const CONFIG = {
  wifeName: "KAZI MUHINA ISLAM",
  husbandName: "KAZI ABDUR RAHIM",
  birthdayDate: "2026-11-23", // Example: "2026-12-05"
  birthdayTime: "00:00:00",   // Bangladesh local time (24-hour clock)
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
তোমার {HUSBAND_NAME} ❤️`
};

(() => {
  "use strict";
  const $ = (selector) => document.querySelector(selector);
  const timezone = "Asia/Dhaka";
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const countdownScreen = $("#countdown-screen");
  const birthdayScreen = $("#birthday-screen");
  const music = $("#background-music");
  let birthdayStarted = false;
  let countdownTimer = null;
  let letterStarted = false;
  let musicStarted = false;

  function validConfig() {
    return /^\d{4}-\d{2}-\d{2}$/.test(CONFIG.birthdayDate) &&
      /^\d{2}:\d{2}:\d{2}$/.test(CONFIG.birthdayTime) &&
      !CONFIG.birthdayDate.startsWith("YYYY");
  }

  // Convert a wall-clock time in Asia/Dhaka to an absolute timestamp.
  // The configured date/time is interpreted as Bangladesh local time,
  // regardless of the visitor's device timezone.
  function dhakaDateToTimestamp(dateString, timeString) {
    const [year, month, day] = dateString.split("-").map(Number);
    const [hour, minute, second] = timeString.split(":").map(Number);
    const desiredUtc = Date.UTC(year, month - 1, day, hour, minute, second);
    const probe = new Date(desiredUtc);
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23"
    }).formatToParts(probe);
    const values = Object.fromEntries(parts.map(p => [p.type, p.value]));
    const representedUtc = Date.UTC(+values.year, +values.month - 1, +values.day,
      +values.hour, +values.minute, +values.second);
    return desiredUtc - (representedUtc - desiredUtc);
  }

  function targetTimestamp() {
    return dhakaDateToTimestamp(CONFIG.birthdayDate, CONFIG.birthdayTime);
  }

  function setPersonalization() {
    const name = CONFIG.wifeName && CONFIG.wifeName !== "YOUR_WIFE_NAME" ? CONFIG.wifeName : "My Love";
    document.title = `Happy Birthday, ${name} ♡`;
    $("#countdown-title").textContent = name + ".";
    $("#birthday-title").innerHTML = `Happy Birthday,<br><span class="script-name"></span><span class="gold-dot">!</span>`;
    $(".script-name").textContent = name;
    const photo = $("#couple-photo");
    const finalPhoto = $("#final-photo");
    [photo, finalPhoto].forEach(img => {
      img.src = CONFIG.couplePhoto;
      img.addEventListener("error", () => {
        img.hidden = true;
        const empty = img.id === "couple-photo" ? $("#photo-empty") : $("#final-photo-empty");
        empty.hidden = false;
      }, { once: true });
      img.addEventListener("load", () => {
        img.hidden = false;
        const empty = img.id === "couple-photo" ? $("#photo-empty") : $("#final-photo-empty");
        empty.hidden = true;
      }, { once: true });
    });
    if (CONFIG.enableMusic && CONFIG.backgroundMusic) music.src = CONFIG.backgroundMusic;
    else $("#music-toggle").hidden = true;
  }

  function updateCountdown() {
    const remaining = targetTimestamp() - Date.now();
    if (remaining <= 0) {
      startBirthday();
      return;
    }
    const totalSeconds = Math.floor(remaining / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    $("#days").textContent = String(days).padStart(2, "0");
    $("#hours").textContent = String(hours).padStart(2, "0");
    $("#minutes").textContent = String(minutes).padStart(2, "0");
    $("#seconds").textContent = String(seconds).padStart(2, "0");
    $("#countdown-date").textContent = new Intl.DateTimeFormat("en", {
      timeZone: timezone, dateStyle: "full", timeStyle: "short"
    }).format(new Date(targetTimestamp())) + " · Bangladesh time";
  }

  function startBirthday() {
    if (birthdayStarted) return;
    birthdayStarted = true;
    if (countdownTimer) clearInterval(countdownTimer);
    countdownScreen.classList.add("leaving");
    countdownScreen.style.transition = "opacity 1s ease, transform 1s ease";
    countdownScreen.style.opacity = "0";
    countdownScreen.style.transform = "scale(1.04)";
    window.setTimeout(() => {
      countdownScreen.hidden = true;
      birthdayScreen.classList.add("visible");
      window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
      burstConfetti(150);
      createBalloons();
      observeReveals();
    }, reducedMotion ? 0 : 850);
  }

  function createParticles() {
    if (reducedMotion) return;
    const field = $("#particle-field");
    const symbols = ["♡", "✦", "✧", "·"];
    function addParticle() {
      const p = document.createElement("span");
      p.className = "particle";
      p.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      p.style.left = `${Math.random() * 100}%`;
      p.style.bottom = "-30px";
      p.style.fontSize = `${10 + Math.random() * 15}px`;
      p.style.animationDuration = `${9 + Math.random() * 9}s`;
      field.appendChild(p);
      window.setTimeout(() => p.remove(), 18000);
    }
    for (let i = 0; i < 18; i++) window.setTimeout(addParticle, i * 250);
    window.setInterval(addParticle, 900);
  }

  function burstConfetti(amount = 90) {
    if (reducedMotion) return;
    const layer = $("#confetti-layer");
    const colors = ["#f2b5c8", "#e8c98d", "#c7b3e6", "#fff0e5", "#d98fa9"];
    for (let i = 0; i < amount; i++) {
      const piece = document.createElement("i");
      piece.className = "confetti";
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.background = colors[i % colors.length];
      piece.style.setProperty("--fall", `${2.3 + Math.random() * 2.8}s`);
      piece.style.setProperty("--drift", `${-100 + Math.random() * 200}px`);
      piece.style.animationDelay = `${Math.random() * .8}s`;
      if (Math.random() > .5) piece.style.borderRadius = "50%";
      layer.appendChild(piece);
      window.setTimeout(() => piece.remove(), 6500);
    }
  }

  function createBalloons() {
    if (reducedMotion) return;
    const colors = ["#e8a6bd", "#c2afe4", "#e8c98d", "#f5dce4"];
    for (let i = 0; i < 9; i++) {
      const balloon = document.createElement("span");
      balloon.className = "particle";
      balloon.textContent = "🎈";
      balloon.style.left = `${5 + Math.random() * 90}%`;
      balloon.style.bottom = "-50px";
      balloon.style.fontSize = `${22 + Math.random() * 18}px`;
      balloon.style.animationDuration = `${9 + Math.random() * 5}s`;
      balloon.style.animationDelay = `${Math.random() * 2}s`;
      $("#particle-field").appendChild(balloon);
      window.setTimeout(() => balloon.remove(), 17000);
    }
  }

  function observeReveals() {
    const items = document.querySelectorAll(".reveal");
    if (reducedMotion || !("IntersectionObserver" in window)) {
      items.forEach(item => item.classList.add("in-view"));
      return;
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach(item => observer.observe(item));
  }

  $("#wish-button").addEventListener("click", () => {
    $(".cake").classList.add("cake-blown");
    $("#wish-message").classList.add("show");
    $("#wish-button").disabled = true;
    $("#wish-button").textContent = "Wish sent with love ♥";
    burstConfetti(75);
  });

  const letterText = CONFIG.loveLetter.replaceAll("{HUSBAND_NAME}",
    CONFIG.husbandName && CONFIG.husbandName !== "YOUR_NAME" ? CONFIG.husbandName : "Your Love");
  $("#envelope-button").addEventListener("click", () => {
    const button = $("#envelope-button");
    if (button.classList.contains("opened")) return;
    button.classList.add("opened");
    button.setAttribute("aria-expanded", "true");
    $("#love-letter").hidden = false;
    if (letterStarted) return;
    letterStarted = true;
    const output = $("#typed-letter");
    if (reducedMotion) {
      output.textContent = letterText;
      $(".typing-cursor").hidden = true;
      return;
    }
    let index = 0;
    const type = () => {
      output.textContent = letterText.slice(0, index++);
      if (index <= letterText.length) window.setTimeout(type, letterText[index - 2] === "\n" ? 180 : 28);
      else $(".typing-cursor").hidden = true;
    };
    type();
  });

  $("#final-surprise-button").addEventListener("click", () => {
    $("#final-overlay").classList.add("open");
    $("#final-overlay").setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    burstConfetti(120);
  });
  function closeFinal() {
    $("#final-overlay").classList.remove("open");
    $("#final-overlay").setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
  $("#close-final").addEventListener("click", closeFinal);
  $("#final-overlay").addEventListener("click", e => {
    if (e.target === $("#final-overlay")) closeFinal();
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeFinal(); });

  $("#music-toggle").addEventListener("click", async () => {
    if (!CONFIG.enableMusic) return;
    try {
      if (music.paused) {
        await music.play(); // Browser permits playback because this follows a tap.
        musicStarted = true;
        $("#music-toggle").classList.add("playing");
        $("#music-toggle").setAttribute("aria-label", "Pause background music");
        $("#music-toggle").title = "Pause background music";
        $(".music-label").textContent = "Pause";
      } else {
        music.pause();
        $("#music-toggle").classList.remove("playing");
        $("#music-toggle").setAttribute("aria-label", "Play background music");
        $("#music-toggle").title = "Play background music";
        $(".music-label").textContent = "Music";
      }
    } catch (error) {
      $(".music-label").textContent = "Tap to play";
    }
  });

  setPersonalization();
  createParticles();
  if (!validConfig()) {
    // A clear setup hint is shown instead of silently running an invalid countdown.
    $("#countdown-date").textContent = "Set birthdayDate in js/script.js to begin the countdown";
    ["days", "hours", "minutes", "seconds"].forEach(id => $("#" + id).textContent = "—");
  } else if (Date.now() >= targetTimestamp()) {
    startBirthday(); // Direct visits after the birthday begins go straight to the celebration.
  } else {
    updateCountdown();
    countdownTimer = window.setInterval(updateCountdown, 1000);
  }
})();
