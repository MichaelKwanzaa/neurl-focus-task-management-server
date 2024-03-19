import mongoose, { Schema, type Document, type ObjectId } from 'mongoose'

export enum TimerTypes{
  POMODORO = 'Pomodoro',
  TASK = 'Task-based',
  INFINITE = 'Infinite'
}

interface TimerDocument extends Document{
    type: string; // Enum for different timer types
    isStarted: boolean; // Indicates if the timer is currently running
    isPaused: boolean; // Indicates if the timer is paused    
}

const TimerSchema = new Schema<TimerDocument>({
    type: {
        type: String,
        required: true,
        enum: ['Pomodoro', 'Task-based', 'Infinite'],
      },
      isStarted: { type: Boolean, default: false },
      isPaused: { type: Boolean, default: false },
},
{
    timestamps: true
})

const Timer = mongoose.model<TimerDocument>('timer', TimerSchema)

export { Timer }