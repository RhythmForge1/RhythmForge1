const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  projectCode: { type: [String], required: true, unique: true },
  size: { type: Number, required: true },
  projectsInProgress: { type: Number, required: true },
  projectsClosed: { type: Number, required: true },
  valueAdds: { type: Number, required: true },
  escalations: { type: Number, required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Member' }],
});

module.exports = mongoose.model('Team', teamSchema);