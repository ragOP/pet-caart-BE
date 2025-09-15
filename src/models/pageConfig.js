const mongoose = require('mongoose');
const { PAGE_ALLOWED_KEYS } = require('../constants/key_mapping');

const SectionSchema = new mongoose.Schema({
   position: { type: Number, required: true },
   key: {
      type: String,
      required: true,
      validate: {
         validator: function (value) {
            const allowed = PAGE_ALLOWED_KEYS[this.parent().pageKey];
            return allowed ? allowed.includes(value) : false;
         },
         message: props => `${props.value} is not allowed for page type ${props.instance.pageKey}`,
      },
   },
   label: { type: String },
   type: {
      type: String,
      enum: ['static', 'grid'],
      default: 'static',
   },
   id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'HomeSection',
      required: function () {
         return this.type === 'grid';
      },
   },
   _id: false,
});

const PageConfigSchema = new mongoose.Schema(
   {
      pageKey: { type: String, required: true },
      sections: [SectionSchema],
   },
   { timestamps: true }
);

module.exports = mongoose.model('PageConfig', PageConfigSchema);
