import { Model } from "@nozbe/watermelondb";
import {
  field,
  date,
  readonly,
  relation,
  writer,
} from "@nozbe/watermelondb/decorators";

export type SetType = "warmup" | "normal" | "dropset" | "failure" | "amrap";

export default class Set extends Model {
  static table = "sets";

  static associations = {
    workout_exercises: {
      type: "belongs_to" as const,
      key: "workout_exercise_id",
    },
  };

  @field("workout_exercise_id") workoutExerciseId!: string;
  @field("set_number") setNumber!: number;
  @field("set_type") setType!: SetType;
  @field("reps") reps!: number;
  @field("weight") weight!: number;
  @field("weight_unit") weightUnit!: string;
  @field("rpe") rpe?: number;
  @field("is_completed") isCompleted!: boolean;
  @field("rest_seconds_planned") restSecondsPlanned?: number;
  @field("rest_seconds_actual") restSecondsActual?: number;
  @readonly @date("created_at") createdAt!: Date;

  @relation("workout_exercises", "workout_exercise_id") workoutExercise: any;

  // Calculate volume (weight × reps)
  public get volume(): number {
    return this.weight * this.reps;
  }

  @writer public async markComplete(actualRestSeconds?: number) {
    await this.update((set) => {
      set.isCompleted = true;
      if (actualRestSeconds !== undefined) {
        set.restSecondsActual = actualRestSeconds;
      }
    });
  }
}
