const GENDER = "REPLACE_ME"; // BOY or GIRL

const revealBtn = document.getElementById("revealBtn");
const modal = document.getElementById("modal");
const closeModal = document.getElementById("closeModal");
const finalReveal = document.getElementById("finalReveal");
const genderText = document.getElementById("genderText");
const flip = document.getElementById("flip");

genderText.textContent = GENDER;

revealBtn?.addEventListener("click", () => {
  modal.classList.add("show");
});

closeModal?.addEventListener("click", () => {
  modal.classList.remove("show");
});

finalReveal?.addEventListener("click", () => {
  flip.classList.add("revealed");
});
