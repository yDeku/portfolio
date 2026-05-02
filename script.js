const discord = document.getElementById('discord');

discord.addEventListener('click', () => {
  navigator.clipboard.writeText('anakinsky01');
  discord.innerText = "Copiado!";
});
