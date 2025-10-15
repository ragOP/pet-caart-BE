const mongoose = require('mongoose');
const campaignSchema = new mongoose.Schema(
   {
      name: { type: String, required: true },
      type: {
         type: String,
         enum: ['whatsapp', 'email', 'push_notification_andriod', 'push_notification_ios'],
         required: true,
      },
      successCount: { type: Number, default: 0 },
      failureCount: { type: Number, default: 0 },
      totalCount: { type: Number, default: 0 },
      successRate: { type: Number, default: 0 },
      startedBy: { type: String, required: true, default: 'admin' },
      users: [
         {
            _id: false,
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            success: { type: Boolean, default: false },
            error: { type: String, default: null },
         },
      ],
   },
   { timestamps: true }
);
module.exports = mongoose.model('Campaign', campaignSchema);
