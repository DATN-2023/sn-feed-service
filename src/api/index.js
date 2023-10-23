module.exports = (app, container) => {
  require('./writeApi')(app, container)
  require('./readApi')(app, container)
  require('./feedApi')(app, container)
  require('./commentApi')(app, container)
  require('./reactionApi')(app, container)
}
