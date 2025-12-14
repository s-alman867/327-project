const inputs = document.querySelectorAll(".input-field");
const toggle_btn = document.querySelectorAll(".toggle");
const main = document.querySelector("main");
const bullets = document.querySelectorAll(".bullets span");
const images = document.querySelectorAll(".image");


document.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', function (event) {
    if (this.getAttribute('href') === '#') {
      event.preventDefault();
    }
  });
});
inputs.forEach((inp) => {
  inp.addEventListener("focus", () => {
    inp.classList.add("active");
  });
  inp.addEventListener("blur", () => {
    if (inp.value != "") return;
    inp.classList.remove("active");
  });
});

toggle_btn.forEach((btn) => {
  btn.addEventListener("click", () => {
    main.classList.toggle("sign-up-mode");
  });
});

function moveSlider() {
  let index = this.dataset.value;

  let currentImage = document.querySelector(`.img-${index}`);
  images.forEach((img) => img.classList.remove("show"));
  currentImage.classList.add("show");

  const textSlider = document.querySelector(".text-group");
  textSlider.style.transform = `translateY(${-(index - 1) * 2.2}rem)`;

  bullets.forEach((bull) => bull.classList.remove("active"));
  this.classList.add("active");
}

bullets.forEach((bullet) => {
  bullet.addEventListener("click", moveSlider);
});


document.addEventListener("DOMContentLoaded", () => {
  const images = document.querySelectorAll(".image");
  const bullets = document.querySelectorAll(".bullets span");
  const textGroup = document.querySelector(".text-group");

  let currentIndex = 0;  

  const updateSlider = (index) => {
    bullets.forEach((b) => b.classList.remove("active"));
    bullets[index].classList.add("active");
    textGroup.style.transform = `translateY(-${index * 2.2}rem)`;

    images.forEach((img, i) => {  
      img.classList.remove("show");
      if (i === index) img.classList.add("show");
    });
  };

  updateSlider(currentIndex);

  images.forEach((image) => {
    image.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % images.length;
      updateSlider(currentIndex);
    });
  });
});
