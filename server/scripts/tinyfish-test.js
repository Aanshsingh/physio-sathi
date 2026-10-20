import 'dotenv/config'
import { tinyfishSearch, tinyfishFetch } from '../src/services/tinyfish.service.js'

const q = process.argv[2] || 'hand pulley exerciser rental price India'
const results = await tinyfishSearch(q)
console.log('SEARCH RESULTS:', results.length)
console.log(results.slice(0, 3))

const urls = results.slice(0, 2).map((r) => r.url)
const fetched = await tinyfishFetch(urls)
console.log('FETCHED:', fetched.results.length, 'ERRORS:', fetched.errors.length)
console.log(JSON.stringify(fetched.results[0], null, 2)?.slice(0, 800))

