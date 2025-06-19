const isValid = (Value) => {
  if (typeof Value === "undefined" || Value === null) return false;
  if (typeof Value === "string" && Value.trim().length === 0) return false;
  if (typeof Value === "number" && isNaN(Value)) return false;
  return true;
};
// User
const isValidName = (name) => /^[a-zA-Z ]+$/.test(name);

const isValidEmail = (email) =>
  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);

const isValidPassword = (password) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{6,20}$/.test(
    password
  );

const isValidPhone = (phone) =>
  /^(?:(?:\+|0{0,2})91(\s*|[\-])?|[0]?)?([6789]\d{2}([ -]?)\d{3}([ -]?)\d{4})$/.test(
    phone
  );

// Product

const isValidNumber = (value) => {
  return typeof value === "number" && value > 0;
};

const isValidRating = (value) => {
  return typeof value === "number" && value >= 1 && value <= 5;
};

const isBoolean = (value) => {
  return typeof value === "boolean";
};

module.exports = {
  isValid,
  isValidName,
  isValidEmail,
  isValidPassword,
  isValidPhone,
  isValidNumber,
  isValidRating,
  isBoolean,
};
