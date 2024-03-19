import mongoose, { Schema, type Document, type ObjectId } from 'mongoose';

interface SettingsDocument extends Document {
  // Timer settings
  user: ObjectId;
  pomodoroWorkTime: number; // Duration of work intervals in minutes
  pomodoroShortBreakTime: number; // Duration of short breaks in minutes
  pomodoroLongBreakTime: number; // Duration of long breaks (after multiple pomodoros) in minutes
  pomodoroIntervalCount: number; // Number of pomodoro intervals before a long break
  blockedUrls: Array<string>
  // Other settings (optional examples)
}

const SettingsSchema = new Schema<SettingsDocument>({
  user: { type: Schema.Types.ObjectId, ref: 'user', required: true },
  pomodoroWorkTime: {
    type: Number,
    required: true,
    default: 25
  },
  pomodoroShortBreakTime: {
    type: Number,
    required: true,
    default: 5
  },
  pomodoroLongBreakTime: {
    type: Number,
    required: true,
    default: 15
  },
  pomodoroIntervalCount: {
    type: Number,
    required: true,
    default: 4
  },
  blockedUrls: [{
    type: String
  }]
}, {
  timestamps: true
});

const Settings = mongoose.model<SettingsDocument>('setting', SettingsSchema);

export { Settings };