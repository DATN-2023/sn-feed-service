module.exports = (app, container) => {
  const { verifyInternalToken } = container.resolve('middleware')
  require('./writeApi')(app, container)
  require('./readApi')(app, container)
  app.use(verifyInternalToken)
  require('./feedApi')(app, container)
  require('./commentApi')(app, container)
  require('./reactionApi')(app, container)
}
