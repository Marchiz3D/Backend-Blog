import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const getAllUser = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    if (!users) {
      res.status(404).json({ message: 'There are no user, add user first!' });
    }
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
    console.log(error);
  }
}

export const signUp = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Cek apakah user sudah ada
    const userExists = await prisma.user.findUnique({
      where: { email },
    });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Mengubah email menjadi lowercase
    const lowerCaseEmail = email.toLowerCase();

    // Buat user baru
    const newUser = await prisma.user.create({
      data: { name, email: lowerCaseEmail, password: hashedPassword, refreshToken: null },
    });

    res.status(201).json({ newUser });
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
    console.log(error);
  }
}

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // cek apakah user ada
    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    // jika user tidak ada
    if (!userExists) {
      return res.status(404).json({ message: 'User not found' });
    }

    // jika user ada
    // cek password
    const isPasswordCorrect = await bcrypt.compare(password, userExists.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid password!' });
    }

    // Membuat token
    const userId = userExists.id;
    const userEmail = userExists.email;
    const username = userExists.name;

    // Membuat token
    const token = jwt.sign({ userId, userEmail, username }, process.env.JWT_SECRET, { expiresIn: '20s' });

    const refreshToken = jwt.sign({ userId, userEmail, username }, process.env.JWT_REFRESH_SECRET, { expiresIn: '1d' });

    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: refreshToken },
    });

    // Membuat cookie
    res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });

    res.status(200).json({ message: "Login Succes", token });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `Server error: ${error}` });
  }
}

export const logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  try {
    // Mencari apakah user telah login
    const user = await prisma.user.findFirst({
      where: {
        refreshToken
      }
    })

    if (!user.refreshToken) {
      return res.status(401).json({ message: 'Unauthorized: User is not logged in' });
    }

    // Hapus cookie user
    const userId = user.id;
    await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        refreshToken: null
      }
    })
    res.clearCookie('refreshToken');
    res.status(200).json('Logged Out');
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `Server error: ${error}` });
  }
}