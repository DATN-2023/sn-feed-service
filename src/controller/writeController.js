module.exports = (container) => {
  const logger = container.resolve('logger')
  const ObjectId = container.resolve('ObjectId')
  const {
    schemaValidator,
    schemas: {
      Reaction
    }
  } = container.resolve('models')
  const { httpCode, serverHelper } = container.resolve('config')
  const { feedRepo, commentRepo, reactionRepo } = container.resolve('repo')
  const { targetType } = Reaction.getConfig()
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
        await feedRepo.deleteFeed(id)
        res.status(httpCode.SUCCESS).json({ ok: true })
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
      const thoauoc = req.body
      const {
        error,
        value
      } = await schemaValidator(thoauoc, 'Comment')
      if (error) {
        return res.status(httpCode.BAD_REQUEST).send({ msg: error.message })
      }
      const sp = await commentRepo.addComment(value)
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
        await commentRepo.deleteComment(id)
        res.status(httpCode.SUCCESS).send({ ok: true })
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
      if (value.targetType === targetType.FEED) {
        await feedRepo.updateFeed(value.targetId, { $inc: { reactionTotal: 1 } })
      } else if (value.targetType === targetType.COMMENT) {
        await commentRepo.updateComment(value.targetId, { $inc: { reactionTotal: 1 } })
      }
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
        const data = await reactionRepo.findOneAndRemove({ targetId, createdBy })
        // console.log(data)
        if (data.targetType === targetType.FEED) {
          await feedRepo.updateFeed(targetId, { $inc: { reactionTotal: -1 } })
        } else if (data.targetType === targetType.COMMENT) {
          await commentRepo.updateComment(targetId, { $inc: { reactionTotal: 1 } })
        }
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
