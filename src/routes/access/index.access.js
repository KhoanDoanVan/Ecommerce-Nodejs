const express = require('express');
const accessController = require('../../controllers/access.controller.js');
const asyncHandler = require('../../helpers/asyncHandler.js');
const { authentication, authenticationV2 } = require('../../auth/authUtils.js');


const router = express.Router();

// Sign up
router.post('/shop/signup', asyncHandler(accessController.signUp));
router.post('/shop/login', asyncHandler(accessController.login));

//authentication
router.use(authenticationV2);

// Logout
router.post('/shop/logout', asyncHandler(accessController.logout))
router.post('/shop/handlerRefreshToken', asyncHandler(accessController.handlerRefreshTokenV2))

module.exports = router;