// copiar discord
const discord = document.getElementById('discord');

discord.addEventListener('click', () => {
  navigator.clipboard.writeText('Deku#0001');
  discord.innerText = "Copiado!";
});
