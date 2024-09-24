'use strict'

const Comment = require('../models/comment.model.js')

const {
  BadRequestError,
  NotFoundError
} = require('../core/error.response.js')

const {
  getProductById
} = require('../models/repositories/product.repo.js')

const {
  transformToObjectId
} = require('../utils/index.js')

class CommentService{
  static async createComment({ productId, userId, content, parentCommentId = null }){
    try{
      const newComment = await Comment.create({
        comment_productId : productId,
        comment_userId : userId,
        comment_content : content,
        comment_parentId : parentCommentId
      })

      let rightValue

      if(parentCommentId){

        const parentComment = await Comment.findById(parentCommentId)

        if(!parentComment){
          throw new NotFoundError('parentComment is not found')
        }

        await Comment.updateMany({ // update right
          comment_productId : transformToObjectId(objectId),
          comment_right : {
            $gt : rightValue
          }
        }, {
          $inc : {
            comment_right : 2
          }
        })

        await Comment.updateMany({ // update left
          comment_productId : transformToObjectId(objectId),
          comment_left : {
            $gt : rightValue
          }
        }, {
          $inc : {
            comment_left : 2
          }
        })



      } else {

        const maxRightValue = await Comment.findOne({
          comment_productId : transformToObjectId(productId)
        }, 'comment_right', {sort : {
          comment_right : -1
        }})

        if(maxRightValue){
          rightValue = maxRightValue.right + 1
        } else {
          rightValue = 1
        }
      }

      newComment.comment_left  = rightValue
      newComment.comment_right = rightValue + 1

      await newComment.save()

      return newComment

    } catch(error) {
      throw new BadRequestError('error createComment')
    }
  }

  static async getListCommentsByParentId({
    productId,
    parentCommentId = null,
    limit = 50,
    offset = 0 // skip
  }){
    try{

      if(parentCommentId){

        const parent = await Comment.findById(parentCommentId)

        if(!parent){
          throw new BadRequestError('parent is not found in getListComment')
        }

        const comments = await Comment.find({
          comment_productId : transformToObjectId(productId),
          comment_left : {
            $gt : parent.comment_left
          },
          comment_right : {
            $lt : parent.comment_right
          }
        }).select({
          comment_left : 1,
          comment_right : 1,
          comment_productId : 1,
          comment_parentId : 1
        }).sort({
          comment_left : 1
        })

        return comments

      } else {
        const comments = await Comment.find({
          comment_productId : transformToObjectId(productId),
          comment_parentId : parentCommentId,
          comment_left : {
            $gt : parent.comment_left
          },
          comment_right : {
            $lt : parent.comment_right
          }
        }).select({
          comment_left : 1,
          comment_right : 1,
          comment_productId : 1,
          comment_parentId : 1
        }).sort({
          comment_left : 1
        })

        return comments
      }

    } catch(error) {
      throw new BadRequestError('error getListComment')
    }
  }


  static async deleteCommentsById({ commentId, productId }){

    try{
      // check productId exist or not
      const product = await getProductById(productId)

      if(!product){
        throw new NotFoundError('product is not found')
      }

      const comment = await Comment.findById( commentId )

      if(!comment){
        throw new NotFoundError('comment is not found')
      }

      const leftValue = comment.comment_left
      const rightValue = comment.comment_right

      // find width
      const width = rightValue - leftValue + 1

      // delete all comment child
      await deleteMany({
        comment_productId : transformToObjectId(productId),
        comment_left : {
          $gt : leftValue,
          $lt : rightValue
        }
      })

      // update value left and right comment other
      await updateMany({
        comment_productId : transformToObjectId(productId),
        comment_left : {
          $gt : rightValue
        }
      }, {
        $inc : {
          comment_left : -width
        }
      })

      await updateMany({
        comment_productId : transformToObjectId(productId),
        comment_right : {
          $gt : rightValue
        }
      }, {
        $inc : {
          comment_right : -width
        }
      })


      return true

    } catch(error) {
      throw new BadRequestError('error deleteCommentsById')
    }
  }
}

module.exports = CommentService