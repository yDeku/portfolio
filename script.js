// SCROLL REVEAL
const elements = document.querySelectorAll('.fade');

window.addEventListener('scroll', () => {
  elements.forEach(el => {
    const top = el.getBoundingClientRect().top;

    if (top < window.innerHeight - 50) {
      el.classList.add('show');
    }
  });
});
