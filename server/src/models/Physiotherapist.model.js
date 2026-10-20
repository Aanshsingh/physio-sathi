import mongoose from 'mongoose'

const physiotherapistSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    qualifications: [{ type: String, trim: true }], // as supplied only, never verified by us
    services: [{ type: String, trim: true }],
    city: { type: String, required: true, trim: true },
    locality: { type: String, trim: true },
    pincode: { type: String, match: /^\d{6}$/ },
    serviceAreas: [{ type: String, trim: true }], // localities and/or pincodes
    serviceRadiusKm: { type: Number, min: 0, max: 100 },
    visitTypes: [{ type: String, enum: ['home', 'centre'] }],
    fees: {
      home: { type: Number, min: 0 },
      centre: { type: Number, min: 0 },
    },
    availabilitySlots: [{ type: String, trim: true }], // only if supplied
    profileStatus: { type: String, enum: ['active', 'pending', 'inactive'], default: 'pending' },
    isSample: { type: Boolean, default: false },
  },
  { timestamps: true }
)

physiotherapistSchema.index({ city: 1, profileStatus: 1 })

export const Physiotherapist = mongoose.model('Physiotherapist', physiotherapistSchema)