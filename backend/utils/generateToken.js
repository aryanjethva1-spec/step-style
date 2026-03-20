import jwt from 'jsonwebtoken';

const generateToken = (res, id, role = 'user') => {
    const token = jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
    
    const cookieName = role === 'brand' ? 'jwtBrand' : 'jwt';

    res.cookie(cookieName, token, {
        httpOnly: true,
        secure: false, // Set to false for local development troubleshooting
        sameSite: 'lax', // Use 'lax' for better cross-origin compatibility on local
        maxAge: 30 * 24 * 60 * 60 * 1000, 
    });
};

export default generateToken;
