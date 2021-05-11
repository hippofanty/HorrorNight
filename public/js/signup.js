function failSignup(signupForm) {
  signupForm.email.setCustomValidity('Вероятно, что вы уже зарегистрированы.');
  signupForm.email.reportValidity();
}

document.forms.signupForm?.addEventListener('submit', async (event) => {
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
        username: event.target.username.value,
        password: event.target.password.value,
      }),
    });
  } catch (err) {
    return failSignup(event.target);
  }
  if (response.status === 401) {
    return failSignup(event.target);
  }
  return window.location.assign('/');
});

// Очищаем кастомные сообщения об ошибках при новом вводе
if (document.forms.signupForm) {
  [
    document.forms.signupForm.username,
    document.forms.signupForm.email,
    document.forms.signupForm.password,
  ].forEach((input) => input.addEventListener('input', (event) => {
    event.target.setCustomValidity('');
    event.target.checkValidity();
  }));
}
