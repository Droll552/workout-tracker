import { Model, Q } from "@nozbe/watermelondb";
import {
  field,
  date,
  readonly,
  children,
  writer,
} from "@nozbe/watermelondb/decorators";

export default class Workout extends Model {
  static table = "workouts";

  static associations = {
    workout_exercises: { type: "has_many" as const, foreignKey: "workout_id" },
    personal_records: { type: "has_many" as const, foreignKey: "workout_id" },
  };

  @field("name") name!: string;
  @date("date") date!: Date;
  @date("start_time") startTime?: Date;
  @date("end_time") endTime?: Date;
  @field("notes") notes?: string;
  @field("is_completed") isCompleted?: boolean;
  @readonly @date("created_at") createdAt!: Date;
  @date("updated_at") updatedAt!: Date;

  @children("workout_exercises") workoutExercises: any;

  public durationMinutes(): number | null {
    if (!this.endTime) return null;
    if (!this.startTime) return null;
    return Math.round(
      (this.endTime.getTime() - this.startTime?.getTime()) / 60000,
    );
  }

  @writer public async complete() {
    await this.update((workout) => {
      workout.isCompleted = true;
      workout.endTime = new Date();
    });
  }
}
