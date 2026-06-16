document.addEventListener("DOMContentLoaded", () => {
    const card = document.querySelector(".wallet-card");
    card.style.opacity = 0;
    card.style.transform = "translateY(30px)";
    
    setTimeout(() => {
      card.style.transition = "all 1s ease";
      card.style.opacity = 1;
      card.style.transform = "translateY(0)";
    }, 200);
  });