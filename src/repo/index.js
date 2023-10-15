const repo = (container) => {
  const feedRepo = require('./feedRepo')(container)
  const commentRepo = require('./commentRepo')(container)
  const reactionRepo = require('./reactionRepo')(container)
  return { feedRepo, commentRepo, reactionRepo }
}
const connect = (container) => {
  const dbPool = container.resolve('db')
  if (!dbPool) throw new Error('Connect DB failed')
  return repo(container)
}

module.exports = { connect }
