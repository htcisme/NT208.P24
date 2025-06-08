import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  authorEmail: {
    type: String,
    trim: true
  },
  activityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Activity',
    required: true
  },
  activitySlug: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

CommentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.models.Comment || mongoose.model('Comment', CommentSchema);