// script.js
document.addEventListener('DOMContentLoaded', function() {
 const contenedor = document.getElementById('contenedor');

 for (let i = 1; i <= 10; i++) {
  const cuadro = document.createElement('div');
  const tamaño = i * 10; // Tamaños: 10x10, 20x20, ..., 100x100
  cuadro.style.width = `${tamaño}px`;
  cuadro.style.height = `${tamaño}px`;
  cuadro.classList.add('cuadro');

  cuadro.addEventListener('click', function() {
   alert(`Cuadro de ${tamaño}x${tamaño} px clickeado!`);
  });

  contenedor.appendChild(cuadro);
 }
});