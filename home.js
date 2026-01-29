/************************************************************
 * EDIT THESE TWO VALUES ONLY
 ************************************************************/
const GENDER = "Ahaan... Antha easy ga chepthama";      // set to "BOY" or "GIRL"
const MEET_DATE = "20140602";     // <-- set their meet date in YYYYMMDD

/************************************************************
 * Cover slideshow (uses your 5 images)
 ************************************************************/
const coverImg = document.getElementById("coverImg");
const pauseBtn = document.getElementById("pauseSlideshow");

const slideshowImages = [
  "images/cover.JPG",
  "images/1.JPG",
  "images/2.JPG",
  "images/3.JPG",
  "images/4.JPG",
];

let slideIndex = 0;
let slideshowTimer = null;
let slideshowPaused = false;

function startSlideshow(){
  if(slideshowTimer) clearInterval(slideshowTimer);
  slideshowTimer = setInterval(() => {
    if(slideshowPaused) return;
    slideIndex = (slideIndex + 1) % slideshowImages.length;
    // fade swap
    coverImg.classList.add("fade-out");
    setTimeout(() => {
      coverImg.src = slideshowImages[slideIndex];
      coverImg.classList.remove("fade-out");
    }, 250);
  }, 2800);
}
startSlideshow();

pauseBtn?.addEventListener("click", () => {
  slideshowPaused = !slideshowPaused;
  pauseBtn.textContent = slideshowPaused ? "Resume Slideshow" : "Pause Slideshow";
});

/************************************************************
 * Typewriter intro
 ************************************************************/
const typewriter = document.getElementById("typewriter");
const lines = [
  "Initializing surprise… ✅",
  "Loading happiness… ✅",
  "Deploying new teammate… 🔒",
  "Please do not push directly to main 😌",
];
let lineIdx = 0;
let charIdx = 0;

function typeLine(){
  const current = lines[lineIdx];
  typewriter.textContent = current.slice(0, charIdx++);
  if(charIdx <= current.length){
    setTimeout(typeLine, 26);
  } else {
    setTimeout(() => {
      // next line
      lineIdx = (lineIdx + 1) % lines.length;
      charIdx = 0;
      typewriter.textContent = "";
      typeLine();
    }, 1100);
  }
}
typeLine();

/************************************************************
 * Team Boy vs Team Girl (local only)
 ************************************************************/
const boyCountEl = document.getElementById("boyCount");
const girlCountEl = document.getElementById("girlCount");
const voteBoy = document.getElementById("voteBoy");
const voteGirl = document.getElementById("voteGirl");
const resetVotes = document.getElementById("resetVotes");

function getCounts(){
  const boy = parseInt(localStorage.getItem("gr_boy") || "0", 10);
  const girl = parseInt(localStorage.getItem("gr_girl") || "0", 10);
  return { boy, girl };
}

function setCounts({boy, girl}){
  localStorage.setItem("gr_boy", String(boy));
  localStorage.setItem("gr_girl", String(girl));
  renderCounts();
}

function renderCounts(){
  const { boy, girl } = getCounts();
  boyCountEl.textContent = boy;
  girlCountEl.textContent = girl;
}
renderCounts();

voteBoy?.addEventListener("click", () => {
  const c = getCounts();
  setCounts({ boy: c.boy + 1, girl: c.girl });
});
voteGirl?.addEventListener("click", () => {
  const c = getCounts();
  setCounts({ boy: c.boy, girl: c.girl + 1 });
});
resetVotes?.addEventListener("click", () => {
  setCounts({ boy: 0, girl: 0 });
});

/************************************************************
 * Reveal flow
 * 1) They remove disabled and click Reveal button
 * 2) Slider challenge (3 attempts, after 2 fails show override input)
 * 3) Countdown 3..2..1
 * 4) Reveal modal flip + confetti
 ************************************************************/
const revealBtn = document.getElementById("revealBtn");
const modal = document.getElementById("modal");
const closeModal = document.getElementById("closeModal");

const stepSlider = document.getElementById("stepSlider");
const stepCountdown = document.getElementById("stepCountdown");
const stepReveal = document.getElementById("stepReveal");

const dateSlider = document.getElementById("dateSlider");
const sliderValue = document.getElementById("sliderValue");
const attemptsLeftEl = document.getElementById("attemptsLeft");
const submitDate = document.getElementById("submitDate");
const feedback = document.getElementById("feedback");

const overrideBox = document.getElementById("overrideBox");
const dateInput = document.getElementById("dateInput");
const nudgeUp = document.getElementById("nudgeUp");
const nudgeDown = document.getElementById("nudgeDown");

const countdownNum = document.getElementById("countdownNum");

const finalReveal = document.getElementById("finalReveal");
const flip = document.getElementById("flip");
const genderText = document.getElementById("genderText");
genderText.textContent = GENDER;

let attempts = 3;
let fails = 0;

function pad8(n){
  const s = String(n);
  return s.padStart(8, "0");
}

function openModal(){
  modal.classList.add("show");
  // reset flow
  attempts = 3;
  fails = 0;
  attemptsLeftEl.textContent = String(attempts);
  feedback.textContent = "";
  overrideBox.classList.add("hidden");
  dateInput.value = "";

  stepSlider.classList.remove("hidden");
  stepCountdown.classList.add("hidden");
  stepReveal.classList.add("hidden");

  // reset slider display
  sliderValue.textContent = pad8(dateSlider.value);
  flip.classList.remove("revealed");
}

function closeTheModal(){
  modal.classList.remove("show");
}

revealBtn?.addEventListener("click", openModal);
closeModal?.addEventListener("click", closeTheModal);
modal?.addEventListener("click", (e) => {
  if(e.target === modal) closeTheModal();
});

dateSlider?.addEventListener("input", () => {
  sliderValue.textContent = pad8(dateSlider.value);
});

nudgeUp?.addEventListener("click", () => {
  dateSlider.value = String(Math.min(99999999, Number(dateSlider.value) + 1));
  sliderValue.textContent = pad8(dateSlider.value);
});
nudgeDown?.addEventListener("click", () => {
  dateSlider.value = String(Math.max(0, Number(dateSlider.value) - 1));
  sliderValue.textContent = pad8(dateSlider.value);
});

function isCorrect(val){
  return String(val) === String(MEET_DATE);
}

function submitAttempt(value){
  const v = String(value);

  if(isCorrect(v)){
    feedback.textContent = "✅ Verified. Okay, you’re officially adorable.";
    startCountdownThenReveal();
    return;
  }

  attempts -= 1;
  fails += 1;
  attemptsLeftEl.textContent = String(attempts);

  // Give them a *fair* clue without giving away the date
  const target = Number(MEET_DATE);
  const guess = Number(v);
  const diff = Math.abs(target - guess);

  if(attempts > 0){
    feedback.textContent = `❌ Not quite. You are ${diff.toLocaleString()} away. Try again 😈`;
  } else {
    feedback.textContent = "💀 Out of attempts. But you’re senior engineers… so an override appears.";
  }

  // After 2 fails, show override input so it’s not miserable
  if(fails >= 2){
    overrideBox.classList.remove("hidden");
  }
}

submitDate?.addEventListener("click", () => {
  submitAttempt(pad8(dateSlider.value));
});

dateInput?.addEventListener("keydown", (e) => {
  if(e.key === "Enter"){
    const cleaned = (dateInput.value || "").replace(/\D/g, "").slice(0, 8);
    if(cleaned.length !== 8){
      feedback.textContent = "Enter 8 digits (YYYYMMDD). No alphabets. No chaos.";
      return;
    }
    submitAttempt(cleaned);
  }
});

function startCountdownThenReveal(){
  stepSlider.classList.add("hidden");
  stepCountdown.classList.remove("hidden");

  let n = 3;
  countdownNum.textContent = String(n);

  const timer = setInterval(() => {
    n -= 1;
    countdownNum.textContent = String(n);
    if(n <= 0){
      clearInterval(timer);
      stepCountdown.classList.add("hidden");
      stepReveal.classList.remove("hidden");
      startConfetti(1200);
    }
  }, 900);
}

/************************************************************
 * Reveal flip + confetti
 ************************************************************/
finalReveal?.addEventListener("click", () => {
  flip.classList.add("revealed");
  startConfetti(2400);
});

/************************************************************
 * Lightweight confetti (same canvas approach)
 ************************************************************/
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");
let confettiPieces = [];
let confettiRunning = false;

function resizeCanvas(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function makeConfetti(n=180){
  const pieces = [];
  for(let i=0;i<n;i++){
    pieces.push({
      x: Math.random()*canvas.width,
      y: -20 - Math.random()*canvas.height*0.3,
      r: 4 + Math.random()*7,
      vy: 2 + Math.random()*6,
      vx: -2 + Math.random()*4,
      rot: Math.random()*Math.PI,
      vr: -0.15 + Math.random()*0.3,
      alpha: 0.95
    });
  }
  return pieces;
}

function drawConfetti(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for(const p of confettiPieces){
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vr;
    if(p.x < -50) p.x = canvas.width + 50;
    if(p.x > canvas.width + 50) p.x = -50;
    p.alpha *= 0.994;

    ctx.save();
    ctx.globalAlpha = Math.max(0, p.alpha);
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = "rgba(255,255,255,0.92)";
    ctx.fillRect(-p.r/2, -p.r/2, p.r, p.r*0.6);
    ctx.restore();
  }
  confettiPieces = confettiPieces.filter(p => p.y < canvas.height + 80 && p.alpha > 0.06);
  if(confettiRunning) requestAnimationFrame(drawConfetti);
}

function startConfetti(ms=2000){
  canvas.classList.add("show");
  confettiPieces = confettiPieces.concat(makeConfetti(220));
  if(!confettiRunning){
    confettiRunning = true;
    drawConfetti();
  }
  setTimeout(() => {
    canvas.classList.remove("show");
    confettiRunning = false;
    confettiPieces = [];
    ctx.clearRect(0,0,canvas.width,canvas.height);
  }, ms);
}

/**********************
 * Baby Spec interactivity
 **********************/
document.querySelectorAll(".baby-toggle").forEach(btn => {
  btn.addEventListener("click", () => {
    const targetSel = btn.getAttribute("data-target");
    const target = document.querySelector(targetSel);
    const isHidden = target.classList.contains("hidden");
    target.classList.toggle("hidden");
    btn.textContent = (isHidden ? "▾ " : "▸ ") + btn.textContent.slice(2);
  });
});

const runTestsBtn = document.getElementById("runTests");
const clearTestsBtn = document.getElementById("clearTests");
const testOutput = document.getElementById("testOutput");

function randomPick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

runTestsBtn?.addEventListener("click", () => {
  const sleep = randomPick(["PASS ✅", "FLAKY ⚠️", "FAIL ❌"]);
  const quiet = randomPick(["FAIL ❌", "FAIL ❌", "FAIL ❌", "UNKNOWN 🤷"]);
  const love = "PASS ✅";
  const coffee = randomPick(["PASS ✅", "PASS ✅", "CRITICAL ✅"]);

  testOutput.classList.remove("hidden");
  testOutput.textContent =
`Running test suite: baby-v1.0

✅ Love.................. ${love}
☕ Coffee dependency..... ${coffee}
😴 Sleep stability....... ${sleep}
🏠 Quiet house........... ${quiet}

Result: Ship it anyway.`;
});

clearTestsBtn?.addEventListener("click", () => {
  testOutput.classList.add("hidden");
  testOutput.textContent = "";
});

/**********************
 * Predictions Board (local-only)
 **********************/
/**********************
 * Predictions Board (local-only) + accordion
 **********************/
const resetPredBtn = document.getElementById("resetPredictions");

function keyFor(q, o){ return `pred_${q}_${o}`; }

function getPredCount(q, o){
  return parseInt(localStorage.getItem(keyFor(q,o)) || "0", 10);
}

function setPredCount(q, o, val){
  localStorage.setItem(keyFor(q,o), String(val));
}

function getTotalVotesForQuestion(predItem){
  const q = predItem.getAttribute("data-q");
  let total = 0;
  predItem.querySelectorAll(".pred-btn").forEach(btn => {
    const o = btn.getAttribute("data-o");
    total += getPredCount(q, o);
  });
  return total;
}

function renderPrediction(predItem){
  const q = predItem.getAttribute("data-q");
  const bars = predItem.querySelector(".pred-bars");
  const meta = predItem.querySelector("[data-meta]");

  const opts = Array.from(predItem.querySelectorAll(".pred-btn")).map(btn => ({
    o: btn.getAttribute("data-o"),
    label: btn.textContent.trim()
  }));

  const counts = opts.map(x => ({...x, c: getPredCount(q, x.o)}));
  const total = counts.reduce((a,x)=>a+x.c,0);

  if(meta){
    meta.textContent = `${total} vote${total === 1 ? "" : "s"}`;
  }

  bars.innerHTML = "";
  counts.forEach(x => {
    const pct = total === 0 ? 0 : Math.round((x.c/total)*100);
    const row = document.createElement("div");
    row.className = "bar";
    row.innerHTML = `
      <div class="muted">${x.label}</div>
      <div class="track"><div class="fill" style="width:${pct}%;"></div></div>
      <div class="mono">${x.c}</div>
    `;
    bars.appendChild(row);
  });
}

function renderAllPredictions(){
  document.querySelectorAll(".pred-item").forEach(renderPrediction);
}
renderAllPredictions();

function resetPredictions(){
  document.querySelectorAll(".pred-item").forEach(predItem => {
    const q = predItem.getAttribute("data-q");
    predItem.querySelectorAll(".pred-btn").forEach(btn => {
      const o = btn.getAttribute("data-o");
      localStorage.removeItem(keyFor(q,o));
    });
  });
  renderAllPredictions();
}
resetPredBtn?.addEventListener("click", resetPredictions);

/* Voting */
document.querySelectorAll(".pred-item .pred-btn").forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    const predItem = btn.closest(".pred-item");
    const q = predItem.getAttribute("data-q");
    const o = btn.getAttribute("data-o");

    setPredCount(q, o, getPredCount(q, o) + 1);
    renderPrediction(predItem);
  });
});

/* Accordion behavior (only one open at a time) */
document.querySelectorAll(".pred-item .pred-head").forEach(head => {
  head.addEventListener("click", () => {
    const item = head.closest(".pred-item");
    const isOpen = item.classList.contains("open");

    // close all
    document.querySelectorAll(".pred-item.open").forEach(x => x.classList.remove("open"));

    // open clicked if it was closed
    if(!isOpen) item.classList.add("open");
  });
});

/* Open first item by default (optional) */
const firstPred = document.querySelector(".pred-item");
if(firstPred) firstPred.classList.add("open");


/************************************************************
 * Console hint (because of course)
 ************************************************************/
console.log("GR-2026 hint: button disabled? inspect element 😌");
console.log("Bonus hint: meet date expects YYYYMMDD.");
