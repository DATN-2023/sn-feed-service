module.exports = (app, container) => {
  const { serverSettings } = container.resolve('config')
  const { reactionController } = container.resolve('controller')
  const { basePath } = serverSettings
  app.get(`${basePath}/reactions`, reactionController.getReaction)
  app.get(`${basePath}/reactions/:id`, reactionController.getReactionById)
  app.put(`${basePath}/reactions/:id`, reactionController.updateReaction)
  app.delete(`${basePath}/reactions/:id`, reactionController.deleteReaction)
  app.post(`${basePath}/reactions`, reactionController.addReaction)
}
