import mongoose from 'mongoose'

const equipmentListingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    category: { type: String, trim: true },
    description: { type: String, trim: true, maxlength: 500 },
    listingType: { type: String, enum: ['rent', 'sale', 'both'], required: true },
    condition: { type: String, enum: ['new', 'used'], default: 'new' },
    salePrice: { type: Number, min: 0 },
    rentalPricePerDay: { type: Number, min: 0 },
    sellerName: { type: String, trim: true },
    city: { type: String, trim: true },
    sourceType: { type: String, enum: ['internal', 'external'], default: 'internal' },
    sourceUrl: { type: String, trim: true }, // external only
    availabilityStatus: { type: String, enum: ['available', 'unavailable', 'unknown'], default: 'unknown' },
    isSample: { type: Boolean, default: false },
  },
  { timestamps: true }
)

equipmentListingSchema.index({ name: 'text', category: 'text', description: 'text' })

export const EquipmentListing = mongoose.model('EquipmentListing', equipmentListingSchema)
