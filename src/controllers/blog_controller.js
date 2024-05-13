import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await prisma.blog.findMany();

    // Cek apakah blog ada atau tidak
    if (!blogs) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json({ blogs });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `Server error: ${error}` });
  }
}

export const addBlog = async (req, res) => {
  const { title, content, description } = req.body;
  const refreshToken = req.cookies.refreshToken;

  try {
    const user = await prisma.user.findFirst({
      where: {
        refreshToken
      }
    })

    if (!user) {
      return res.status(404).json({ message: "User hasn't login" });
    }

    const userId = parseInt(user.id);

    const blog = await prisma.blog.create({
      data: {
        title,
        content,
        description,
        userId
      }
    })

    res.status(201).json({ message: "Blog created successfully", blog });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `Server error: ${error}` });
  }
}

export const updateBlog = async (req, res) => {
  try {
    // Mengambil data user
    const refreshToken = req.cookies.refreshToken;
    const user = await prisma.user.findFirst({
      where: {
        refreshToken,
      }
    })

    // Mengambil id blog
    const blog = await prisma.blog.findFirst({
      where: {
        user
      }
    });

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Mengupdate data blog
    const idBlog = parseInt(blog.id);
    const { title, content, description } = req.body;
    const newBlog = await prisma.blog.update({
      where: {
        id: idBlog
      },
      data: {
        title,
        content,
        description
      }
    })

    if (!newBlog) {
      return res.status(404).json({ messsage: 'Blog not found' });
    }

    res.status(200).json({ message: 'Update data success', newBlog });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `Server error: ${error}` });
  }
}

export const deleteBlog = async (req, res) => {
  try {
    // Mengambil data user
    const refreshToken = req.cookies.refreshToken;
    const user = await prisma.user.findFirst({
      where: {
        refreshToken,
      }
    })

    // Mengambil id blog
    const blog = await prisma.blog.findFirst({
      where: {
        user
      }
    });

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Delete blog
    const idblog = parseInt(blog.id);
    await prisma.blog.delete({
      where: {
        id: idblog,
      }
    })

    res.status(200).json({ message: "Delete blog success" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `Server error: ${error}` });
  }
}