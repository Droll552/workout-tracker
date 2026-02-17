import {
  database,
  exercisesCollection,
  userSettingsCollection,
} from "../index";
import { exerciseSeedData } from "./exerciseData";

export async function seedExercises(): Promise<void> {
  // Check if already seeded
  const existingCount = await exercisesCollection.query().fetchCount();
  if (existingCount > 0) {
    return;
  }

  await database.write(async () => {
    const batch = exerciseSeedData.map((exercise) =>
      exercisesCollection.prepareCreate((record) => {
        record.name = exercise.name;
        record.category = exercise.category;
        record.equipment = exercise.equipment;
        record.difficulty = exercise.difficulty;
        record.muscleGroupsRaw = JSON.stringify(exercise.muscleGroups);
        record.instructions = exercise.instructions || "";
        record.isCustom = false;
        // created_at and updated_at handled by @readonly decorator
      }),
    );

    await database.batch(...batch);
  });

}

export async function seedUserSettings(): Promise<void> {
  const existingCount = await userSettingsCollection.query().fetchCount();
  if (existingCount > 0) {
    return;
  }

  try {
    await database.write(async () => {
      const settings = await userSettingsCollection.create((settings) => {
        settings.weightUnit = "kg";
        settings.defaultRestSeconds = 90;
        settings.theme = "system";
        settings.notificationsEnabled = true;
      });
    });
  } catch (error) {
    console.error("EXACT ERROR IN seedUserSettings:", error);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    throw error;
  }
}

export async function initializeDatabase(): Promise<void> {
  try {
    await seedExercises();
    await seedUserSettings();
  } catch (error) {
    console.error("Database initialization failed:", error);
    console.error("Error details:", JSON.stringify(error, null, 2));
    console.error("Error stack:", error.stack);
    throw error;
  }
}
