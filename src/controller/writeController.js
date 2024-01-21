module.exports = (container) => {
  const logger = container.resolve('logger')
  const ObjectId = container.resolve('ObjectId')
  const publisher = container.resolve('publisher')
  const {
    schemaValidator,
    schemas: {
      Reaction
    }
  } = container.resolve('models')
  const { httpCode, serverHelper, workerConfig } = container.resolve('config')
  const { feedRepo, commentRepo, reactionRepo } = container.resolve('repo')
  const { targetType } = Reaction.getConfig()
  const typeConfig = {
    COMMENT: 1,
    REACTFEED: 2,
    POST: 3,
    SHARE: 4,
    FOLLOW: 5,
    UNREACT: 6,
    UNFOLLOW: 7,
    REACTCOMMENT: 8
  }
  const addFeed = async (req, res) => {
    try {
      const thoauoc = req.body
      const {
        error,
        value
      } = await schemaValidator(thoauoc, 'Feed')
      if (error) {
        return res.status(httpCode.BAD_REQUEST).json({ msg: error.message })
      }
      const sp = await feedRepo.addFeed(value)
      res.status(httpCode.CREATED).json(sp)
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).end()
    }
  }
  const deleteFeed = async (req, res) => {
    try {
      const { id } = req.params
      if (id) {
        const feed = await feedRepo.deleteFeed(id)
        res.status(httpCode.SUCCESS).json(feed)
      } else {
        res.status(httpCode.BAD_REQUEST).end()
      }
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).json({ ok: false })
    }
  }
  const updateFeed = async (req, res) => {
    try {
      const { id } = req.params
      const feed = req.body
      const {
        error,
        value
      } = await schemaValidator(feed, 'Feed')
      if (error) {
        return res.status(httpCode.BAD_REQUEST).json({ msg: error.message })
      }
      if (id && feed) {
        const sp = await feedRepo.updateFeed(id, value)
        res.status(httpCode.SUCCESS).json(sp)
      } else {
        res.status(httpCode.BAD_REQUEST).end()
      }
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).json({ ok: false })
    }
  }
  const addComment = async (req, res) => {
    try {
      const comment = req.body
      const {
        error,
        value
      } = await schemaValidator(comment, 'Comment')
      if (error) {
        return res.status(httpCode.BAD_REQUEST).send({ msg: error.message })
      }
      const sp = await commentRepo.addComment(value)
      const feed = await feedRepo.updateFeed(sp.feed.toString(), { $inc: { commentTotal: 1 } })
      const payload = {
        user: sp.createdBy.toString(),
        alertUser: feed.createdBy.toString(),
        type: typeConfig.COMMENT,
        feed: feed._id.toString(),
        comment: sp._id.toString()
      }
      await publisher.sendToQueue(payload, workerConfig.queueName)
      res.status(httpCode.CREATED).send(sp)
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).end()
    }
  }
  const deleteComment = async (req, res) => {
    try {
      const { id } = req.params
      if (id) {
        const comment = await commentRepo.findOneAndRemove({ _id: new ObjectId(id) })
        if (comment) {
          await feedRepo.updateFeed(comment.feed, { $inc: { commentTotal: -1 } })
          res.status(httpCode.SUCCESS).send({ ok: true })
        }
      } else {
        res.status(httpCode.BAD_REQUEST).end()
      }
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).send({ ok: false })
    }
  }
  const updateComment = async (req, res) => {
    try {
      const { id } = req.params
      const comment = req.body
      const {
        error,
        value
      } = await schemaValidator(comment, 'Comment')
      if (error) {
        return res.status(httpCode.BAD_REQUEST).send({ msg: error.message })
      }
      if (id && comment) {
        const sp = await commentRepo.updateComment(id, value)
        res.status(httpCode.SUCCESS).send(sp)
      } else {
        res.status(httpCode.BAD_REQUEST).end()
      }
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).send({ ok: false })
    }
  }
  const addReaction = async (req, res) => {
    try {
      const reaction = req.body
      const {
        error,
        value
      } = await schemaValidator(reaction, 'Reaction')
      if (error) {
        return res.status(httpCode.BAD_REQUEST).send({ msg: error.message })
      }
      const sp = await reactionRepo.addReaction(value)
      let item
      if (value.targetType === targetType.FEED) {
        item = await feedRepo.updateFeed(value.targetId, { $inc: { reactionTotal: 1 } })
      } else if (value.targetType === targetType.COMMENT) {
        item = await commentRepo.updateComment(value.targetId, { $inc: { reactionTotal: 1 } })
      }
      const payload = {
        user: sp.createdBy.toString(),
        alertUser: item.createdBy.toString(),
        feed: item.feed ? item.feed.toString() : item._id.toString(),
        comment: item.feed ? item._id.toString() : '',
        reactionType: sp.type,
        reaction: sp._id.toString()
      }
      if (value.targetType === targetType.FEED) {
        payload.type = typeConfig.REACTFEED
      } else if (value.targetType === targetType.COMMENT) {
        payload.type = typeConfig.REACTCOMMENT
      }
      await publisher.sendToQueue(payload, workerConfig.queueName)
      res.status(httpCode.CREATED).json(sp)
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).end()
    }
  }
  const deleteReaction = async (req, res) => {
    try {
      const { id: targetId } = req.params
      const { createdBy } = req.body
      if (targetId) {
        const sp = await reactionRepo.findOneAndRemove({ targetId, createdBy })
        // console.log(data)
        let item
        if (sp.targetType === targetType.FEED) {
          item = await feedRepo.updateFeed(targetId, { $inc: { reactionTotal: -1 } })
        } else if (sp.targetType === targetType.COMMENT) {
          item = await commentRepo.updateComment(targetId, { $inc: { reactionTotal: -1 } })
        }
        const payload = {
          user: sp.createdBy.toString(),
          alertUser: item.createdBy.toString(),
          type: typeConfig.UNREACT,
          feed: item.feed ? item.feed.toString() : item._id.toString(),
          comment: item.feed ? item._id.toString() : '',
          reactionType: sp.type,
          reaction: sp._id.toString()
        }
        await publisher.sendToQueue(payload, workerConfig.queueName)
        res.status(httpCode.SUCCESS).send({ ok: true })
      } else {
        res.status(httpCode.BAD_REQUEST).end()
      }
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).send({ ok: false })
    }
  }
  const updateReaction = async (req, res) => {
    try {
      const { id } = req.params
      const reaction = req.body
      const {
        error,
        value
      } = await schemaValidator(reaction, 'Reaction')
      if (error) {
        return res.status(httpCode.BAD_REQUEST).send({ msg: error.message })
      }
      if (id && reaction) {
        const sp = await reactionRepo.updateReaction(id, value)
        res.status(httpCode.SUCCESS).send(sp)
      } else {
        res.status(httpCode.BAD_REQUEST).end()
      }
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).send({ ok: false })
    }
  }
  return {
    addFeed,
    updateFeed,
    deleteFeed,
    addComment,
    deleteComment,
    updateComment,
    addReaction,
    deleteReaction,
    updateReaction
  }
}
