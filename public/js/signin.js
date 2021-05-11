function failSignin(signinForm) {
  signinForm.email.setCustomValidity('Неверные email и/или пароль.');
  signinForm.email.reportValidity();
}

document.forms.signinForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const { method, action } = event.target;
  let response;
  try {
    response = await fetch(action, {
      method,
      headers: {
        'Content-Type': 'application/json',
        credentials: 'include',
      },
      body: JSON.stringify({
        email: event.target.email.value,
        password: event.target.password.value,
      }),
    });
  } catch (err) {
    return failSignin(event.target);
  }
  if (response.status === 401) {
    return failSignin(event.target);
  }
  return window.location.assign('/');
});

// Очищаем кастомные сообщения об ошибках при новом вводе
if (document.forms.signinForm) {
  [
    document.forms.signinForm.email,
    document.forms.signinForm.password,
  ].forEach((input) => input.addEventListener('input', (event) => {
    event.target.setCustomValidity('');
    event.target.checkValidity();
  }));
}
