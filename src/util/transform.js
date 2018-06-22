const transform = {
  capitalize: (text) => text.toLowerCase().replace(/\b[a-z]/g, letter => letter.toUpperCase()),
  sanitize: (text) => text.replace(/[\W_]+/g, ' ')
};
export default transform;
