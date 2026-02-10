import { Model } from "@nozbe/watermelondb";
import { field, date, readonly } from "@nozbe/watermelondb/decorators";

export default class BodyMeasurement extends Model {
  static table = "body_measurements";
  static associations = {};

  @date("date") date!: Date;
  @field("weight") weight?: number;
  @field("body_fat") bodyFat?: number;
  @field("measurements") measurementsRaw?: string;
  @field("notes") notes?: string;
  @readonly @date("created_at") createdAt!: Date;

  public get measurements(): Record<string, number> {
    try {
      return JSON.parse(this.measurementsRaw || "{}");
    } catch {
      return {};
    }
  }
}
