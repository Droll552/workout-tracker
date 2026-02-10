import { Model } from "@nozbe/watermelondb";
import { field, relation } from "@nozbe/watermelondb/decorators";

export default class TemplateExercise extends Model {
  static table = "template_exercises";

  static associations = {
    workout_templates: { type: "belongs_to" as const, key: "template_id" },
    exercises: { type: "belongs_to" as const, key: "exercise_id" },
  };

  @field("template_id") templateId!: string;
  @field("exercise_id") exerciseId!: string;
  @field("order") order!: number;
  @field("target_sets") targetSets!: number;
  @field("target_reps") targetReps!: string;
  @field("target_weight") targetWeight?: number;
  @field("target_rpe") targetRpe?: number;
  @field("rest_seconds") restSeconds?: number;
  @field("notes") notes?: string;
  @field("superset_group") supersetGroup?: number;
  @field("superset_order") supersetOrder?: number;

  @relation("workout_templates", "template_id") template: any;
  @relation("exercises", "exercise_id") exercise: any;
}
