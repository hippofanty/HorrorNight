const burger = document.querySelector('.burger');
const menu = document.querySelector(`#${burger.dataset.target}`);
burger.addEventListener('click', () => {
  burger.classList.toggle('is-active');
  menu.classList.toggle('is-active');
});
