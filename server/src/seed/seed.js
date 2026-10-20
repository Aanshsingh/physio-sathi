import 'dotenv/config'
import mongoose from 'mongoose'
import  {connectDb}from '../config/db.js'
import  {Physiotherapist}  from '../models/physiotherapist.model.js'

// SAMPLE DATA ONLY. Names, fees, slots and pincodes are placeholders for the demo.
// Qualifications are placeholders, not verified. Edit pincodes to match the areas you demo.
const base = { profileStatus: 'active', isSample: true }

const physios = [
  { name: 'Physio Anita (Sample)', city: 'Faridabad', locality: 'Sector 15', pincode: '121007',
    serviceAreas: ['Sector 15', 'Sector 16', 'Sector 14', '121007'], serviceRadiusKm: 6,
    visitTypes: ['home', 'centre'], fees: { home: 600, centre: 400 }, qualifications: ['BPT'],
    services: ['Post-fracture rehab', 'Sports injury'], availabilitySlots: ['Mon-Sat morning'] },
  { name: 'Physio Rohit (Sample)', city: 'Faridabad', locality: 'NIT', pincode: '121001',
    serviceAreas: ['NIT', 'Sector 21C', '121001'], serviceRadiusKm: 5,
    visitTypes: ['home'], fees: { home: 500 }, qualifications: ['BPT'],
    services: ['Post-surgery rehab'] },
  { name: 'Physio Meena (Sample)', city: 'Faridabad', locality: 'Sector 21C', pincode: '121001',
    serviceAreas: ['Sector 21C', 'NIT'], serviceRadiusKm: 3,
    visitTypes: ['centre'], fees: { centre: 350 }, qualifications: ['BPT', 'MPT'],
    services: ['Back and neck pain', 'Hand rehab'], availabilitySlots: ['Mon-Fri 10am-6pm'] },
  { name: 'Physio Karan (Sample)', city: 'Faridabad', locality: 'Ballabhgarh', pincode: '121004',
    serviceAreas: ['Ballabhgarh', 'Sector 62', '121004'], serviceRadiusKm: 8,
    visitTypes: ['home', 'centre'], fees: { home: 700, centre: 450 }, qualifications: ['BPT'],
    services: ['Elderly care rehab'] },
  { name: 'Physio Sunita (Sample)', city: 'Faridabad', locality: 'Greater Faridabad', pincode: '121009',
    serviceAreas: ['Greater Faridabad', '121009'], serviceRadiusKm: 7,
    visitTypes: ['home'], fees: { home: 800 }, qualifications: ['MPT'],
    services: ['Neuro rehab'], availabilitySlots: ['Evenings'] },
  { name: 'Physio Vikram (Sample)', city: 'Delhi', locality: 'Lajpat Nagar', pincode: '110024',
    serviceAreas: ['Lajpat Nagar', 'Defence Colony', '110024'], serviceRadiusKm: 6,
    visitTypes: ['home', 'centre'], fees: { home: 900, centre: 600 }, qualifications: ['BPT'],
    services: ['Sports injury'] },
  { name: 'Physio Neha (Sample)', city: 'Delhi', locality: 'Saket', pincode: '110017',
    serviceAreas: ['Saket', 'Malviya Nagar', '110017'], serviceRadiusKm: 5,
    visitTypes: ['home'], fees: { home: 1000 }, qualifications: ['MPT'],
    services: ['Post-surgery rehab'] },
  { name: 'Physio Arjun (Sample)', city: 'Gurugram', locality: 'Sector 14', pincode: '122001',
    serviceAreas: ['Sector 14', 'Sector 15', '122001'], serviceRadiusKm: 6,
    visitTypes: ['centre'], fees: { centre: 700 }, qualifications: ['BPT'],
    services: ['Back and neck pain'] },
  { name: 'Physio Pooja (Sample)', city: 'Noida', locality: 'Sector 62', pincode: '201309',
    serviceAreas: ['Sector 62', 'Sector 63', '201309'], serviceRadiusKm: 6,
    visitTypes: ['home', 'centre'], fees: { home: 850, centre: 550 }, qualifications: ['BPT'],
    services: ['Hand rehab'] },
].map((p) => ({ ...base, ...p }))

const connected = await connectDb()
if (!connected) {
  console.error('Seed failed: database not connected')
  process.exit(1)
}
await Physiotherapist.deleteMany({ isSample: true })
const created = await Physiotherapist.insertMany(physios)
console.log(`Seeded ${created.length} sample physiotherapists`)
await mongoose.disconnect()