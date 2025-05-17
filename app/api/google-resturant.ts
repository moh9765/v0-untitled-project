import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { lat, lng } = req.query
  const apiKey = 'AIzaSyC0ZhUZr_TJfxw9bNTckmCPuuIhljImDww'

  if (!lat || !lng) {
    return res.status(400).json({ error: "Missing location data" })
  }

  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&type=restaurant&key=${apiKey}`

  const response = await fetch(url)
  const data = await response.json()

  res.status(200).json(data.results)
}