
// Discord (copiar)
const discord = document.getElementById('discord');

discord.addEventListener('click', () => {
  navigator.clipboard.writeText('anakinsky01');
  alert('Discord copiado!');
});

// WhatsApp (abrir)
const whatsapp = document.getElementById('whatsapp');

whatsapp.addEventListener('click', () => {
  window.open('https://wa.me/5500000000000', '_blank');
});
