import jwt from 'jsonwebtoken';

const generateToken = (res, id, role = 'user') => {
  const token = jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  const cookieName = role === 'brand' ? 'jwtBrand' : 'jwt';
  const isProduction = process.env.NODE_ENV === 'production';

  res.cookie(cookieName, token, {
    httpOnly: true,
    secure: isProduction,                 // true on Render
    sameSite: isProduction ? 'none' : 'lax', // none for Vercel -> Render
    maxAge: 30 * 24 * 60 * 60 * 1000,
    path: '/',
  });
};

export default generateToken;