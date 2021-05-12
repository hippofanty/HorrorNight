const trackBtn = document.querySelector('.hidden-btn');

trackBtn.addEventListener('click', async () => {
  // event.preventDefault();
  const link = document.querySelector('.single-link').getAttribute('href');
  const id = link.slice(7);

  const response = await fetch(link, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
  });
});
