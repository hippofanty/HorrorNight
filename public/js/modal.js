const modalBtn = document.querySelector('.watch-btn');
const modal = document.querySelector('.modal');
const closeModal = document.querySelector('.modal-close');
const iframe = document.querySelector('iframe');

if (modalBtn) {
  modalBtn.addEventListener('click', (event) => {
    const { id } = event.target;

    modal.classList.toggle('is-active');
    iframe.setAttribute('src', `https://www.youtube.com/embed/${id}`);
  });
}

if (closeModal) {
  closeModal.addEventListener('click', () => {
    modal.classList.toggle('is-active');
    iframe.toggleAttribute('src');
  });
}
