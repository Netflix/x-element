const form = document.getElementById('form');

form.addEventListener('submit', event => {
  event.preventDefault();
  const formData = new FormData(form);
  const entries = [...formData.entries()];
  console.log(entries); // eslint-disable-line no-console
});

// TODO: This doesn’t appear to be working just yet.
// form.addEventListener('formdata', event => {
//   console.log([...event.formData.entries()]);
// });
