const wlBox = document.querySelector('.wl-box');

wlBox.addEventListener('click', async (event) => {
  if (event.target.classList.contains('del-btn')) {
    event.preventDefault();
    const action = document.querySelector('.menu-list').children[2].children[0].getAttribute('href');
    const link = event.target.closest('.card-content').children[0].children[0].children[0].children[0].getAttribute('href');
    const id = link.slice(7);

    const response = await fetch(action, {
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
