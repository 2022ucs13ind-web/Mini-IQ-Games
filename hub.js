const sound = document.getElementById("hoverSound");

/* First user click enables audio */
document.addEventListener("click", () => {
  sound.play().then(() => {
    sound.pause();
    sound.currentTime = 0;
  });
}, { once: true });

/* Hover sound */
document.querySelectorAll(".game-card").forEach(card => {
  card.addEventListener("mouseenter", () => {
    sound.currentTime = 0;
    sound.play();
  });
});
