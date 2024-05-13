import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken; // Mengambil refreshtoken dari cookie
  try {
    // cek apakah refreshtoken ada
    if (!refreshToken) {
      return res.status(401).json('Unauthorized');
    }

    // cek apakah ada user
    const user = await prisma.user.findFirst({
      where: {
        refreshToken
      }
    })

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify refreshtoken
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      const userId = user.id;
      const userEmail = user.email;
      const username = user.name;
      const accessToken = jwt.sign({ id: userId, email: userEmail, name: username }, process.env.JWT_SECRET, { expiresIn: '15m' });
      res.json({ accessToken });
    })
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
    console.log(error);
  }
};

