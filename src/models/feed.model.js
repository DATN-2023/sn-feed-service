module.exports = (joi, mongoose, { joi2MongoSchema, schemas }) => {
  const { ObjectId } = mongoose.Types
  const feedType = {
    POST: 1,
    SHARE: 2
  }
  const feedJoi = joi.object({
    content: joi.string().default(''),
    images: joi.array().items(joi.string()),
    createdBy: joi.string().required(),
    groupId: joi.string().default('').allow(''),
    commentTotal: joi.number().default(0),
    shareTotal: joi.number().default(0),
    reactionTotal: joi.number().default(0),
    updatedAt: joi.number().default(Math.floor(Date.now() / 1000)),
    type: joi.number().valid(...Object.values(feedType)).default(feedType.POST)
  })
  const feedSchema = joi2MongoSchema(feedJoi, {
    createdBy: {
      type: ObjectId
    },
    groupId: {
      type: ObjectId
    }
  }, {
    createdAt: {
      type: Number,
      default: () => Math.floor(Date.now() / 1000)
    }
  })
  feedSchema.statics.validateObj = (obj, config = {}) => {
    return feedJoi.validate(obj, config)
  }
  feedSchema.statics.validateTaiLieu = (obj, config = {
    allowUnknown: true,
    stripUnknown: true
  }) => {
    return feedJoi.validate(obj, config)
  }
  const feedModel = mongoose.model('Feed', feedSchema)
  feedModel.syncIndexes()
  return feedModel
}
