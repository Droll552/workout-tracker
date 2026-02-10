import { Model } from "@nozbe/watermelondb";
import {
  field,
  date,
  readonly,
  children,
} from "@nozbe/watermelondb/decorators";

export default class WorkoutTemplate extends Model {
  static table = "workout_templates";

  static associations = {
    template_exercises: {
      type: "has_many" as const,
      foreignKey: "template_id",
    },
  };

  @field("name") name!: string;
  @field("description") description?: string;
  @field("estimated_duration") estimatedDuration?: number;
  @readonly @date("created_at") createdAt!: Date;
  @date("updated_at") updatedAt!: Date;

  @children("template_exercises") templateExercises: any;
}
