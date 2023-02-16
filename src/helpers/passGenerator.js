const CHARACTERS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

const generatePwd = () => {
  let pwd;

  for (let i = 0; i < 10; i++) {
    pwd += CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length));
  }
  return pwd;
};

module.exports = generatePwd;
