import db from '../../db'

export default async (req, res) => {
  const { rows } = await db.query('SELECT * FROM users')
  res.json(rows)
}