import { Model } from "@nozbe/watermelondb";
import {
  field,
  date,
  readonly,
  children,
} from "@nozbe/watermelondb/decorators";

export type ExerciseType = "cardio" | "strength";

export default class Exercise extends Model {
  static table = "exercises";

  static associations = {
    workout_exercises: { type: "has_many" as const, foreignKey: "exercise_id" },
    template_exercises: {
      type: "has_many" as const,
      foreignKey: "exercise_id",
    },
    personal_records: { type: "has_many" as const, foreignKey: "exercise_id" },
  };

  @field("name") name!: string;
  @field("category") category!: string;
  @field("type") type?: ExerciseType;
  @field("equipment") equipment!: string;
  @field("difficulty") difficulty?: string;
  @field("muscle_groups") muscleGroupsRaw!: string; // JSON string
  @field("instructions") instructions?: string;
  @field("image_url") imageUrl?: string;
  @field("is_custom") isCustom!: boolean;
  @readonly @date("created_at") createdAt!: Date;
  @date("updated_at") updatedAt!: Date;

  // Helper to parse muscle groups
  public get muscleGroups(): string[] {
    try {
      return JSON.parse(this.muscleGroupsRaw || "[]");
    } catch {
      return [];
    }
  }

  @children("workout_exercises") workoutExercises: any;
  @children("personal_records") personalRecords: any;
}
