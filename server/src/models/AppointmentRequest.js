import mongoose from 'mongoose'

// Stores only what is needed to contact the patient. No medical details.
const appointmentRequestSchema = new mongoose.Schema(
  {
    provider: { type: mongoose.Schema.Types.ObjectId, ref: 'Physiotherapist', required: true, index: true },
    patientName: { type: String, required: true, trim: true, maxlength: 80 },
    phone: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    locality: { type: String, trim: true, maxlength: 60 },
    pincode: { type: String, match: /^\d{6}$/ },
    visitType: { type: String, enum: ['home', 'centre'], required: true },
    preferredDate: { type: Date, required: true },
    preferredTime: { type: String, enum: ['morning', 'afternoon', 'evening', 'flexible'], default: 'flexible' },
    note: { type: String, trim: true, maxlength: 200 },
    status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' },
  },
  { timestamps: true }
)

export const AppointmentRequest = mongoose.model('AppointmentRequest', appointmentRequestSchema)
