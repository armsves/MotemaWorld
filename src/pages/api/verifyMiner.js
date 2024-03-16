import db from '../db'

export default async (req, res) => {
  if (req.method === 'POST') {
    const { nullifier_hash } = req.body
    try {
      const result = await db.query('SELECT id as miner_id, address FROM miners where nullifier_hash = $1', [nullifier_hash])
      const result2 = await db.query('SELECT * FROM donations where miner_id = $1 ORDER BY create_time desc', [result.rows[0].miner_id]);
      const currentTime = new Date();
      let difference = 0;
      if (result2.rows.length !== 0) { 
        difference = currentTime.getDate() - result2?.rows[0].create_time.getDate();
      }
      
      console.log('difference',difference)
      if (result2.rows.length === 0 || difference >= 1) {
        await db.query('INSERT INTO donations(create_time, miner_id) VALUES($1, $2) RETURNING *', [currentTime, result.rows[0].miner_id])
        res.status(200).json(result.rows[0].address)
      } else {
        res.status(200).json({ message: 'Miner already received donation within 24hs' })
      }
    } catch (err) {
      res.status(200).json({ message: 'Miner is not registered.' })
    }
  } else {
    res.status(405).json({ message: 'We only accept POST' })
  }
}