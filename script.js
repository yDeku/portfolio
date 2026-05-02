// Scroll reveal
const revealElements = document.querySelectorAll('.reveal');

function revealOnScroll() {
  revealElements.forEach((element) => {
    const elementTop = element.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (elementTop < windowHeight - 80) {
      element.classList.add('active');
    }
  });
}

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// Discord copiar
const discord = document.getElementById('discord');

discord.addEventListener('click', () => {
  navigator.clipboard.writeText('anakinsky01');

  const feedback = discord.querySelector('.contact-feedback');
  feedback.textContent = 'copiado';

  setTimeout(() => {
    feedback.textContent = 'copiar';
  }, 1500);
});

// WhatsApp abrir
const whatsapp = document.getElementById('whatsapp');

whatsapp.addEventListener('click', () => {
  window.open('https://wa.me/5500000000000', '_blank');
});
