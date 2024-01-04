// mockFsSerializer.js
module.exports = {
  print(val) {
    return JSON.stringify(val, null, 2); // Pretty-print JSON for readability
  },
  test(val) {
    return typeof val === 'string';
  },
};
