import express from "express";
import { addBlog, deleteBlog, getAllBlogs, updateBlog } from "../controllers/blog_controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const blogRouter = express.Router();

blogRouter.get('/', verifyToken, getAllBlogs);

blogRouter.post('/add', verifyToken, addBlog);

blogRouter.patch('/update', verifyToken, updateBlog);

blogRouter.delete('/delete', verifyToken, deleteBlog);

export default blogRouter;

