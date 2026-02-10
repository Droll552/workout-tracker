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

console.log('Exercise associations:', Exercise.associations);
console.log('Workout associations:', Workout.associations);
console.log('WorkoutExercise associations:', WorkoutExercise.associations);
console.log('Set associations:', Set.associations); // ← ADD THIS
console.log('TemplateExercise associations:', TemplateExercise.associations);
console.log('WorkoutTemplate associations:', WorkoutTemplate.associations); // ← ADD THIS
console.log('PersonalRecord associations:', PersonalRecord.associations);
console.log('BodyMeasurement associations:', BodyMeasurement.associations); // ← ADD THIS
console.log('UserSettings associations:', UserSettings.associations); 

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
