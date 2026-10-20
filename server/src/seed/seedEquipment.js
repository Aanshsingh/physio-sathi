import 'dotenv/config'
import mongoose from 'mongoose'
import {connectDb} from '../config/db.js'
import { EquipmentListing } from '../models/equipmentListing.model.js'

// SAMPLE DATA ONLY. Prices and seller names are placeholders for the demo, not real listings.
const seller = 'Sample Medical Store (Sample)'
const base = { sellerName: seller, city: 'Faridabad', sourceType: 'internal', availabilityStatus: 'unknown', isSample: true }

const items = [
  { name: 'Hand pulley exerciser', category: 'Upper limb', listingType: 'both', salePrice: 450, rentalPricePerDay: 15,
    description: 'Overhead pulley set for shoulder and hand range-of-motion exercises, as advised by a physiotherapist.' },
  { name: 'Walking frame (walker)', category: 'Mobility', listingType: 'both', salePrice: 1200, rentalPricePerDay: 25,
    description: 'Foldable aluminium walker with height adjustment.' },
  { name: 'Wheelchair (foldable)', category: 'Mobility', listingType: 'both', salePrice: 3500, rentalPricePerDay: 60,
    description: 'Standard foldable wheelchair.' },
  { name: 'TENS unit', category: 'Electrotherapy', listingType: 'both', salePrice: 1800, rentalPricePerDay: 40,
    description: 'Portable TENS device. Use only as advised by a qualified physiotherapist.' },
  { name: 'Knee brace', category: 'Support', listingType: 'sale', salePrice: 900,
    description: 'Adjustable knee support brace.' },
  { name: 'Cervical collar', category: 'Support', listingType: 'sale', salePrice: 350,
    description: 'Soft cervical collar.' },
  { name: 'Underarm crutches (pair)', category: 'Mobility', listingType: 'both', salePrice: 700, rentalPricePerDay: 20,
    description: 'Adjustable aluminium crutches.' },
  { name: 'Wheelchair (used)', category: 'Mobility', listingType: 'sale', condition: 'used', salePrice: 2200,
    description: 'Pre-owned foldable wheelchair. Condition not verified by Physio Sathi.' },
  { name: 'Walking frame (used)', category: 'Mobility', listingType: 'sale', condition: 'used', salePrice: 700,
    description: 'Pre-owned walker. Condition not verified by Physio Sathi.' },
].map((i) => ({ ...base, ...i }))

const connected = await connectDb()
if (!connected) {
  console.error('Seed failed: database not connected')
  process.exit(1)
}
await EquipmentListing.deleteMany({ isSample: true })
const created = await EquipmentListing.insertMany(items)
console.log(`Seeded ${created.length} sample equipment listings`)
await mongoose.disconnect()
