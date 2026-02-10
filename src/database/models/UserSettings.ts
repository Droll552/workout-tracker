import { Model } from "@nozbe/watermelondb";
import { field, date, writer } from "@nozbe/watermelondb/decorators";

export default class UserSettings extends Model {
  static table = "user_settings";

  static associations = {};

  @field("weight_unit") weightUnit!: string;
  @field("default_rest_seconds") defaultRestSeconds!: number;
  @field("theme") theme!: string;
  @field("notifications_enabled") notificationsEnabled!: boolean;
  @date("updated_at") updatedAt!: Date;

  @writer public async updateSettings(
    changes: Partial<{
      weightUnit: string;
      defaultRestSeconds: number;
      theme: string;
      notificationsEnabled: boolean;
    }>,
  ) {
    await this.update((settings) => {
      if (changes.weightUnit) settings.weightUnit = changes.weightUnit;
      if (changes.defaultRestSeconds)
        settings.defaultRestSeconds = changes.defaultRestSeconds;
      if (changes.theme) settings.theme = changes.theme;
      if (changes.notificationsEnabled != undefined) {
        settings.notificationsEnabled = changes.notificationsEnabled;
      }
    });
  }
}
