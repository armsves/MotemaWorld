import db from '../db'

export default async (req, res) => {
  if (req.method === 'POST') {
    const { create_time, address, nullifier_hash } = req.body
    console.log('create_time', create_time)
    console.log('address', address)
    console.log('nullifier_hash', nullifier_hash)
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