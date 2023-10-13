module.exports = (container) => {
  const feedController = require('./feedController')(container)
  return { feedController }
}
