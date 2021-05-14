// const imgPreview = document.getElementById('img-preview');
// const fileUpload = document.getElementById('file-upload');

// fileUpload.addEventListener('change', async (event) => {
//   const file = event.target.files[0];
//   const formData = new FormData();
//   formData.append('file', file);
//   formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

//   const response = await fetch(CLOUDINARY_URL, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded',
//     },
//     data: formData,
//   }).then((res) => {
//     console.log(res);
//     imgPreview.src = res.data.secure_url;
//   }).catch((err) => {
//     console.error(err);
//   });
// });
