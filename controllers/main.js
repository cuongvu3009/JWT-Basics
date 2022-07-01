const jwt = require('jsonwebtoken');
const CustomAPIError = require('../errors/custom-error');
require('dotenv').config();

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new CustomAPIError('Username and password must be required', 401);
  }
  const { id } = new Date().getDate();
  const token = jwt.sign({ id, username }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });

  res.status(201).json({ msg: 'user created', token });
};

const dashboard = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new CustomAPIError('No token provided', 404);
  }
  const token = authHeader.split(' ')[1];

  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    const randomNumber = Math.floor(Math.random() * 100);
    res.status(200).json({
      msg: `Hello ${decoded.username} - id:${decoded.iat}`,
      secret: `Here is your secret number: <h3>${randomNumber}</h3> `,
    });
  } catch (error) {
    throw new CustomAPIError('Not authorized to access this route', 401);
  }
};

module.exports = { login, dashboard };
