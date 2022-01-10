module.exports = {
  '*.{ts,js,json,yml,md}': 'yarn prettier --write',
  '*.{ts,js}': 'yarn lint --fix'
};
