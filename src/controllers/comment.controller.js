'use strict'

const {
  SuccessResponse
} = require('../core/success.response.js')

const CommentService = require('../services/comment.service.js')

class CommentController{
  createComment = async (req, res, next) => {
    new SuccessResponse({
      message : 'create comment success !!!',
      metadata : await CommentService.createComment( req.body )
    }).send(res)
  }

  getListComments = async (req, res, next) => {
    new SuccessResponse({
      message : 'get list comments success !!!',
      metadata : await CommentService.getListCommentsByParentId( req.body )
    }).send(res)
  }

  deleteComment = async (req, res, next) => {
    new SuccessResponse({
      message : 'delete comment success !!!',
      metadata : await CommentService.deleteCommentsById( req.query )
    }).send(res)
  }
}

module.exports = new CommentController()