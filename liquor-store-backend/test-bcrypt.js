const bcrypt = require('bcryptjs');

const hash = '$2a$10$fq9QZ6b8DWxpkT7Ja3fSPOjShpBLmPPTnWZTg7h87YTRxEYe5ApZK';
const password = 'admin123';

bcrypt.compare(password, hash, (err, result) => {
  console.log("Comparación:", result);
});
