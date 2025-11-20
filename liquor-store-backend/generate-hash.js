const bcrypt = require('bcryptjs');

const passwords = [
  "admin123",
  "juan123",
  "maria123",
  "carlos123"
];

passwords.forEach(pwd => {
  const hash = bcrypt.hashSync(pwd, 10);
  console.log(pwd, "=>", hash);
});
