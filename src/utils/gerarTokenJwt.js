import jwt from 'jsonwebtoken'

export const gerarToken = (nome, email) => {
  return jwt.sign({ nome, email }, process.env.JWT_SECRET, { expiresIn: '24h' });
}
