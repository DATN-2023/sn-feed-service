module.exports = container => {
  const { schemas } = container.resolve('models')
  const { Comment } = schemas
  const addComment = (cate) => {
    const c = new Comment(cate)
    return c.save()
  }
  const getCommentById = (id) => {
    return Comment.findById(id)
  }
  const deleteComment = (id) => {
    return Comment.findByIdAndRemove(id, { useFindAndModify: false })
  }
  const updateComment = (id, n) => {
    return Comment.findByIdAndUpdate(id, n, {
      useFindAndModify: false,
      returnOriginal: false
    })
  }
  const checkIdExist = (id) => {
    return Comment.findOne({ id })
  }
  const getCount = (pipe = {}) => {
    return Comment.countDocuments(pipe)
  }
  const getCommentAgg = (pipe) => {
    return Comment.aggregate(pipe)
  }
  const getComment = (pipe, limit, skip, sort) => {
    return Comment.find(pipe).limit(limit).skip(skip).sort(sort)
  }
  const getCommentNoPaging = (pipe) => {
    return Comment.find(pipe)
  }
  const removeComment = (pipe) => {
    return Comment.deleteMany(pipe)
  }
  const findOneAndRemove = (pipe) => {
    return Comment.where().findOneAndRemove(pipe)
  }
  return {
    getCommentNoPaging,
    removeComment,
    addComment,
    getCommentAgg,
    getCommentById,
    deleteComment,
    updateComment,
    checkIdExist,
    getCount,
    getComment,
    findOneAndRemove
  }
}
