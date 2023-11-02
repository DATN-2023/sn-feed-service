module.exports = (joi, mongoose, { joi2MongoSchema, schemas }) => {
  const { ObjectId } = mongoose.Types
  const commentJoi = joi.object({
    content: joi.string().default(''),
    images: joi.array().items(joi.string()).default([]),
    createdBy: joi.string().required(),
    rank: joi.number().required(),
    // parent: joi.when('rank', {
    //   is: 1,
    //   then: joi.string().default(''),
    //   otherwise: joi.objectId().required()
    // }),
    mention: joi.object().default({}),
    parent: joi.string().default(''),
    reactionTotal: joi.number().default(0),
    feed: joi.string().required(),
    updatedAt: joi.number().default(Math.floor(Date.now() / 1000))
  })
  const commentSchema = joi2MongoSchema(commentJoi, {
    createdBy: {
      type: ObjectId
    },
    parent: {
      type: ObjectId,
      ref: 'Comment'
      // default: ''
    },
    feed: {
      type: ObjectId,
      index: true,
      ref: 'Feed'
    }
  }, {
    createdAt: {
      type: Number,
      default: () => Math.floor(Date.now() / 1000)
    }
  })
  commentSchema.statics.validateObj = (obj, config = {}) => {
    return commentJoi.validate(obj, config)
  }
  commentSchema.statics.validateTaiLieu = (obj, config = {
    allowUnknown: true,
    stripUnknown: true
  }) => {
    return commentJoi.validate(obj, config)
  }
  const commentModel = mongoose.model('Comment', commentSchema)
  commentModel.syncIndexes()
  return commentModel
}
