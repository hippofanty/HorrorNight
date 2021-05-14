// отслеживание фильма
const trackBtn = document.querySelector('.appr-btn');

trackBtn?.addEventListener('click', async () => {
  const link = document.querySelector('.single-link').getAttribute('href');
  const id = link.slice(7);

  const response = await fetch(link, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
  });

  if (response.status === 200) {
    trackBtn.textContent = 'Добавлен';

    const buttonCol = document.querySelector('.buttons-col');
    const isFilmAdded = document.createElement('button');
    isFilmAdded.classList.add('button', 'is-danger', 'is-outlined', 'is-added-btn');
    isFilmAdded.setAttribute('disabled', 'disabled');
    isFilmAdded.innerText = 'В вашем списке просмотра';

    buttonCol.children[2].after(isFilmAdded);
  }
});

// Добавление комментария
const commentBtn = document.querySelector('.comment-btn');

document.forms.commentForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const { method, action } = event.target;
  const { id } = commentBtn.dataset;
  const text = document.querySelector('.textarea');

  const response = await fetch(`${action}${id}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content: event.target.content.value,
      id,
    }),
  });

  const result = await response.json();

  if (response.status === 200) {
    text.value = '';
    const timeSinceCreation = Math.round(
      (Date.now() - new Date(result.lastComment.createdAt)) / 1000 / 60
    );
    const article = document.createElement('article');
    article.classList.add('media');
    article.innerHTML = `
    <figure class="media-left">
      <p class="image is-64x64">
        <img src="https://bulma.io/images/placeholders/128x128.png">
      </p>
    </figure>
    <div class="media-content">
      <div class="content">
        <p>
          <strong>${result.lastComment.author.username}</strong>
          <br>
          ${result.lastComment.content}
          <br>
          <small><a>Like</a> · <a>Reply</a> · ${timeSinceCreation} min</small>
        </p>
      </div>
    </div>
    `;
    const commentArea = document.querySelector('.comment-area');
    commentArea.before(article);
  }
});

const rateGroup = document.querySelector('.rating-group');
const showRate = document.querySelector('.show-rate');
const allInput = document.querySelectorAll('input');

// Оценка фильма
if (!showRate?.innerText) {
  rateGroup?.addEventListener('click', async (event) => {
    if (event.target.classList.contains('rating__input')) {
      const action = event.target.closest('#ratingForm').getAttribute('action');

      const id = action.slice(7, -8);
      const rate = event.target.value;

      const response = await fetch(action, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rate,
          id,
        }),
      });

      if (response.status === 200) {
        const ratingApplied = document.querySelector('.show-tooltip');
        ratingApplied.removeAttribute('hidden');
        ratingApplied.innerHTML = '<b>Успешно!</b><br>Ваша оценка сохранена';

        setTimeout(() => {
          ratingApplied.toggleAttribute('hidden');
          window.location.reload();
        }, 1500);
      }
    }
  });
}

// правка уже поставленной оценки
if (showRate?.innerText) {
  for (let i = 0; i < allInput.length; i += 1) {
    if (allInput[i].value === showRate.innerText) {
      allInput[i].setAttribute('checked', 'checked');
    }
  }

  rateGroup?.addEventListener('click', async (event) => {
    if (event.target.classList.contains('rating__input')) {
      const action = event.target.closest('#ratingForm').getAttribute('action');

      const id = action.slice(7, -8);
      const rate = event.target.value;

      const response = await fetch(action, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rate,
          id,
        }),
      });

      if (response.status === 200) {
        const ratingApplied = document.querySelector('.show-tooltip');
        ratingApplied.removeAttribute('hidden');
        ratingApplied.innerHTML = '<b>Успешно!</b><br>Ваша оценка сохранена';

        setTimeout(() => ratingApplied.toggleAttribute('hidden'), 1500);
      }
    }
  });
}

const scroll = document.querySelector('.scrolling-col');
scroll.scrollTop = 9999;
