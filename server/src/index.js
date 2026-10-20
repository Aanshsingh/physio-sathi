import 'dotenv/config'
import app from './app.js'
import { connectDb } from './config/db.js'

await connectDb()
app.listen(process.env.PORT || 5000, () => console.log('API running'))