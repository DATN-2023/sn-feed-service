module.exports = (app, container) => {
  const { serverSettings } = container.resolve('config')
  const { readController } = container.resolve('controller')
  const { basePath } = serverSettings
  app.get(`${basePath}/sdp/feeds`, readController.getFeed)
  app.get(`${basePath}/sdp/feeds/:id`, readController.getFeedById)
  app.get(`${basePath}/sdp/comments`, readController.getComment)
  app.get(`${basePath}/sdp/comments/:id`, readController.getCommentById)
  app.get(`${basePath}/sdp/reactions`, readController.getReaction)
  app.get(`${basePath}/sdp/reactions/:id`, readController.getReactionById)
}
