import { appSchema, tableSchema } from "@nozbe/watermelondb";

export const schema = appSchema({
  version: 1,
  tables: [
    // Exercise Library
    tableSchema({
      name: "exercises",
      columns: [
        { name: "name", type: "string" },
        { name: "category", type: "string" }, // chest, back, legs, etc.
        { name: "type", type: "string", isOptional: true }, //strength, cardio
        { name: "equipment", type: "string" }, //barbell, dumbell
        { name: "difficulty", type: "string", isOptional: true }, //beginner, intermidiate
        { name: "muscle_groups", type: "string" }, //JSON array as string
        { name: "instructions", type: "string", isOptional: true },
        { name: "image_url", type: "string", isOptional: true },
        { name: "is_custom", type: "boolean" },
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
      ],
    }),

    // User Workouts
    tableSchema({
      name: "workouts",
      columns: [
        { name: "name", type: "string" },
        { name: "date", type: "number" }, // timestamp
        { name: "start_time", type: "number", isOptional: true },
        { name: "end_time", type: "number", isOptional: true },
        { name: "notes", type: "string", isOptional: true },
        { name: "is_completed", type: "boolean", isOptional: true }, //todo: think scenarios where this possibly could be needed
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
      ],
    }),

    // Exercises within a Workout (junction table with extras)
    tableSchema({
      name: "workout_exercises",
      columns: [
        { name: "workout_id", type: "string", isIndexed: true },
        { name: "excercise_id", type: "string", isIndexed: true },
        { name: "order", type: "number" },
        { name: "notes", type: "string", isOptional: true },
        { name: "superset_group", type: "number", isOptional: true },
        { name: "superset_order", type: "number", isOptional: true },
        { name: "rest_seconds", type: "number", isOptional: true },
        { name: "created_at", type: "number" },
      ],
    }),

    // Individual Sets
    tableSchema({
      name: "sets",
      columns: [
        { name: "workout_exercise_id", type: "string", isIndexed: true },
        { name: "set_number", type: "number" },
        { name: "set_type", type: "string", isOptional: true }, //warmup, normal, dropset, failure, amrap
        { name: "reps", type: "number" },
        { name: "weight", type: "number" },
        { name: "weight_unit", type: "string" },
        { name: "rpe", type: "number", isOptional: true }, //Target Rate of Perceived Exertion 1-10.
        { name: "is_completed", type: "boolean" },
        { name: "rest_seconds_planned", type: "number", isOptional: true },
        { name: "rest_seconds_actual", type: "number", isOptional: true },
        { name: "created_at", type: "number" },
      ],
    }),

    // Workout Templates
    tableSchema({
      name: "workout_templates",
      columns: [
        { name: "name", type: "string" },
        { name: "description", type: "string", isOptional: true },
        { name: "estimated_duration", type: "number", isOptional: true },
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
      ],
    }),

    // Template Exercises
    tableSchema({
      name: "template_excersises",
      columns: [
        { name: "template_id", type: "string", isIndexed: true },
        { name: "exercise_id", type: "string", isIndexed: true },
        { name: "order", type: "number" },
        { name: "target_sets", type: "number" },
        { name: "target_reps", type: "string" }, // 6-12 format
        { name: "target_weight", type: "number", isOptional: true },
        { name: "target_rpe", type: "number", isOptional: true }, // Target Rate of Perceived Exertion. It is a training method used to define how hard an exercise should feel on a specific day, rather than prescribing a set weight, pace, or heart rate.
        { name: "rest_seconds", type: "number", isOptional: true },
        { name: "notes", type: "string", isOptional: true },
        { name: "superset_group", type: "number", isOptional: true },
        { name: "supreset_order", type: "number", isOptional: true },
      ],
    }),

    // Personal Records
    tableSchema({
      name: "personal_records",
      columns: [
        { name: "exercise_id", type: "string", isIndexed: true },
        { name: "record_type", type: "string" }, // 1rm, max_weight, max_reps
        { name: "value", type: "number" },
        { name: "workout_id", type: "string", isOptional: true },
        { name: "achieved_at", type: "number" }, //timestamp
        { name: "created_at", type: "number" },
      ],
    }),

    // Body Measurements
    tableSchema({
      name: "body_measurements",
      columns: [
        { name: "date", type: "number" },
        { name: "weight", type: "number", isOptional: true },
        { name: "body_fat", type: "number", isOptional: true },
        { name: "measurements", type: "string", isOptional: true },
        { name: "notes", type: "string", isOptional: true },
        { name: "created_at", type: "number" },
      ],
    }),

    tableSchema({
      name: "user_settings",
      columns: [
        { name: "weight_units", type: "string" },
        { name: "default_rest_seconds", type: "number" },
        { name: "theme", type: "string" }, // light, dark, system
        { name: "notifications_enabled", type: "boolean" },
        { name: "updated_at", type: "number" },
      ],
    }),
  ],
});
