import mongoose from 'mongoose';

const scriptSchema = new mongoose.Schema({
  script: {
    type: String,
    required: true,
  },
  runResults: {
    type: Array,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

scriptSchema.statics.findByUser = async function findScriptsByUser(userId) {
  const scripts = await this.find({ user: userId }).select('-__v -user');
  return scripts;
};

scriptSchema.statics.findSingleScript = async function findSingleScript(scriptId) {
  const script = await this.findById(scriptId).select('-__v -user');
  return script;
};

scriptSchema.index({ script: 1, user: 1 }, { unique: true });

const Script = mongoose.model('Script', scriptSchema);
export default Script;
