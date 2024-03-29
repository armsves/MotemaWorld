import db from '../db'

export default async (req, res) => {
  if (req.method === 'POST') {
    const { address, nullifier_hash } = req.body
    const create_time = new Date();
    try {
      const result = await db.query('INSERT INTO miners(create_time, address, nullifier_hash) VALUES($1, $2, $3) RETURNING *', [create_time, address, nullifier_hash])
      res.status(200).json(result.rows[0])
    } catch (err) {
      res.status(500).json({ message: 'Something went wrong.' })
    }
  } else {
    res.status(405).json({ message: 'We only accept POST' })
  }
}