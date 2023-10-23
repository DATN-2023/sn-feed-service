module.exports = (joi, mongoose, {
  joi2MongoSchema,
  schemas
}) => {
  const { ObjectId } = mongoose.Types
  const reactionType = {
    LIKE: 1,
    LOVE: 2,
    LAUGH: 3,
    WOW: 4,
    SAD: 5,
    ANGRY: 6
  }
  const targetType = {
    FEED: 1,
    COMMENT: 2
  }
  const reactionJoi = joi.object({
    type: joi.number().valid(...Object.values(reactionType)).required(),
    createdBy: joi.string().required(),
    targetId: joi.string().required(),
    targetType: joi.number().valid(...Object.values(targetType)).required(),
    updatedAt: joi.number().default(Math.floor(Date.now() / 1000))
  })
  const reactionSchema = joi2MongoSchema(reactionJoi, {
    createdBy: {
      type: ObjectId
    },
    targetId: {
      type: ObjectId,
      index: true
    }
  }, {
    createdAt: {
      type: Number,
      default: () => Math.floor(Date.now() / 1000)
    }
  })
  reactionSchema.statics.validateObj = (obj, config = {}) => {
    return reactionJoi.validate(obj, config)
  }
  reactionSchema.statics.validateTaiLieu = (obj, config = {
    allowUnknown: true,
    stripUnknown: true
  }) => {
    return reactionJoi.validate(obj, config)
  }
  const reactionModel = mongoose.model('Reaction', reactionSchema)
  reactionModel.syncIndexes()
  return reactionModel
}
