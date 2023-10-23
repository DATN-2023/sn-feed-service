module.exports = (container) => {
  const feedController = require('./feedController')(container)
  const commentController = require('./commentController')(container)
  const reactionController = require('./reactionController')(container)
  const writeController = require('./writeController')(container)
  const readController = require('./readController')(container)
  return { feedController, commentController, reactionController, writeController, readController }
}
