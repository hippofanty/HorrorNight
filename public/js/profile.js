const wlBox = document.querySelector('.wl-box');
const deleteBtn = document.querySelector('.del-btn');

wlBox.addEventListener('click', async (event) => {
  if (event.target.classList.contains('del-btn')) {
    event.preventDefault();
    const link = event.target.closest('.card-content').children[0].children[0].children[0].children[0].getAttribute('href');
    const id = link.slice(7);

    const response = await fetch(link, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
      }),
    });

    if (response.status === 200) {
      event.target.closest('.wl-column').remove();
    }
  }
});
