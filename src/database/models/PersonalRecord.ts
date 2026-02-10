import {Model} from '@nozbe/watermelondb'
import {field, date, readonly, relation} from '@nozbe/watermelondb/decorators'

export type RecordType = '1rm' | 'max_weight' | 'max_reps' | 'max_volume'

export default class PersonalRecord extends Model {
    static table = 'personal_records'

    static associations = {
        exercises: {type: 'belongs_to' as const, key: 'exercise_id'},
        workouts: {type: 'belongs_to' as const, key: 'workout_id'}
    }

    @field('exercise_id') exerciseId!: string
    @field('record_type') recordType!: RecordType
    @field('value') value!: number
    @field('workout_id') workoutId? : string
    @date('achieved_at') achievedAt!: Date
    @readonly @date('created_at') createdAt!: Date

    @relation('exercises', 'exercise_id') exercise: any
    @relation('workouts', 'workout_id') workout: any
}

