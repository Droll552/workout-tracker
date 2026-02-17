import { Database } from "@nozbe/watermelondb";
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite";
import { schema } from "./schema";
import {
  Exercise,
  Workout,
  WorkoutExercise,
  Set,
  WorkoutTemplate,
  TemplateExercise,
  BodyMeasurement,
  UserSettings,
  PersonalRecord,
} from "./models";

const adapter = new SQLiteAdapter({
  schema,
  jsi: true,
  onSetUpError: (error) => {
    console.error("Database setup error: ", error);
  },
});

export const database = new Database({
  adapter,
  modelClasses: [
    Exercise,
    Workout,
    WorkoutExercise,
    Set,
    WorkoutTemplate,
    TemplateExercise,
    PersonalRecord,
    BodyMeasurement,
    UserSettings,
  ],
});

export const exercisesCollection = database.get<Exercise>("exercises");
export const workoutsCollection = database.get<Workout>("workouts");
export const workoutExercisesCollection =
  database.get<WorkoutExercise>("workout_exercises");
export const setsCollection = database.get<Set>("sets");
export const templatesCollection =
  database.get<WorkoutTemplate>("workout_templates");
export const templateExercisesCollection =
  database.get<TemplateExercise>("template_exercises");
export const personalRecordsCollection =
  database.get<PersonalRecord>("personal_records");
export const bodyMeasurementsCollection =
  database.get<BodyMeasurement>("body_measurements");
export const userSettingsCollection =
  database.get<UserSettings>("user_settings");
