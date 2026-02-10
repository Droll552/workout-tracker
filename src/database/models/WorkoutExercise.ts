import { Model } from "@nozbe/watermelondb";
import {
  field,
  date,
  readonly,
  relation,
  children,
} from "@nozbe/watermelondb/decorators";

export default class WorkoutExercise extends Model {
  static table = "workout_exercises";

  static associations = {
    workouts: { type: "belongs_to" as const, key: "workout_id" },
    exercises: { type: "belongs_to" as const, key: "exercise_id" },
    sets: { type: "has_many" as const, foreignKey: "workout_exercise_id" },
  };

  @field("workout_id") workoutId!: string;
  @field("exercise_id") exerciseId!: string;
  @field("order") order!: number;
  @field("notes") notes?: string;
  @field("superset_group") supersetGroup?: number;
  @field("superset_order") supersetOrder?: number;
  @field("rest_seconds") restSeconds!: number;

  @readonly @date("created_at") createdAt!: Date;

  @relation("workouts", "workout_id") workout: any;
  @relation("exercises", "exercise_id") exercise: any;
  @children("sets") sets: any;

  public get isSuperset(): boolean {
    return this.supersetGroup !== null && this.supersetGroup !== undefined;
  }
}
