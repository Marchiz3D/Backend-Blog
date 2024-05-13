import jwt from 'jsonwebtoken';

// verify token
export const verifyToken = (req, res, next) => {
  const headers = req.headers['authorization'];
  const token = headers && headers.split(' ')[1];

  console.log(token);
  if (token == null) {
    return res.status(401).json({ message: 'Invalid token!' });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.userId = decoded.id;
    next();
  })
}