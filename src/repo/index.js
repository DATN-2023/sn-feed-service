const repo = (container) => {
  const feedRepo = require('./feedRepo')(container)
  return { feedRepo }
}
const connect = (container) => {
  const dbPool = container.resolve('db')
  if (!dbPool) throw new Error('Connect DB failed')
  return repo(container)
}

module.exports = { connect }
