import { verify } from 'jsonwebtoken';

export default function authMiddleware(handler) {
  return async (req, res) => {
    const token = req.cookies.token;

    if (!token) {
      res.writeHead(302, { Location: '/login' });
      res.end();
      return;
    }

    try {
      const decoded = verify(token, 'secretKey');
      req.user = decoded;
      return handler(req, res);
    } catch (error) {
      res.writeHead(302, { Location: '/login' });
      res.end();
    }
  };
}