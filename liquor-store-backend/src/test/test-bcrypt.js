const bcrypt = require('bcryptjs');

const hash = '$2b$10$/c.xCgWIx2HIasmZt8aQ6ey3pHz/DVlBlmRe1ENDWgl2y/qjlrzMK';
const password = 'admin123';

bcrypt.compare(password, hash, (err, result) => {
  console.log("Comparación:", result);
});
