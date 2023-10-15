module.exports = container => {
  const { schemas } = container.resolve('models')
  const { comment } = schemas
  const addcomment = (cate) => {
    const c = new comment(cate)
    return c.save()
  }
  const getcommentById = (id) => {
    return comment.findById(id)
  }
  const deletecomment = (id) => {
    return comment.findByIdAndRemove(id, { useFindAndModify: false })
  }
  const updatecomment = (id, n) => {
    return comment.findByIdAndUpdate(id, n, {
      useFindAndModify: false,
      returnOriginal: false
    })
  }
  const checkIdExist = (id) => {
    return comment.findOne({ id })
  }
  const getCount = (pipe = {}) => {
    return comment.countDocuments(pipe)
  }
  const getcommentAgg = (pipe) => {
    return comment.aggregate(pipe)
  }
  const getcomment = (pipe, limit, skip, sort) => {
    return comment.find(pipe).limit(limit).skip(skip).sort(sort)
  }
  const getcommentNoPaging = (pipe) => {
    return comment.find(pipe)
  }
  const removecomment = (pipe) => {
    return comment.deleteMany(pipe)
  }
  return {
    getcommentNoPaging,
    removecomment,
    addcomment,
    getcommentAgg,
    getcommentById,
    deletecomment,
    updatecomment,
    checkIdExist,
    getCount,
    getcomment
  }
}
