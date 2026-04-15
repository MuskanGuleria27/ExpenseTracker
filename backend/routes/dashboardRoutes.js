 const express = require('express');
 const{protect}=require('../middleware/authMiddleware');
 const router=express.Router();
 const {getDashboardData}=require('../controllers/dashboardController');

router.get("/",protect,getDashboardData);

module.exports=router;