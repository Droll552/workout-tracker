import {create} from 'zustand'
import { database, workoutsCollection, workoutExercisesCollection, setsCollection } from '../database';
import Workout from '../database/models/Workout'
import WorkoutExercise from '../database/models/WorkoutExercise';
import Set, {SetType} from '../database/models/Set'

interface ActiveSet {
    id?: string //undefined if not saved yet
    setNumber: number
    setType: SetType
    reps: number
    weight: number
    weightUnit: string
    rpe?: number
    isCompleted: boolean
    restSecondsPlanned: number
}

interface ActiveExercise { 
    id?: string
    tempId: string // For UI tracking before save
    exerciseId: string
    exerciseName: string
    order: number
    sets: ActiveSet[]
    restSeconds: number
    supersetGroup?: number
    notes?: string
}

interface WorkoutState {
  // Active workout data
  isActive: boolean;
  workoutId: string | null;
  workoutName: string;
  startTime: Date | null;
  exercises: ActiveExercise[];
  
  // Actions
  startWorkout: (name?: string) => Promise<string>;
  endWorkout: () => Promise<void>;
  discardWorkout: () => Promise<void>;
  
  addExercise: (exerciseId: string, exerciseName: string, defaultRestSeconds?: number) => void;
  removeExercise: (tempId: string) => void;
  reorderExercises: (fromIndex: number, toIndex: number) => void;
  
  addSet: (exerciseTempId: string) => void;
  updateSet: (exerciseTempId: string, setIndex: number, updates: Partial<ActiveSet>) => void;
  removeSet: (exerciseTempId: string, setIndex: number) => void;
  completeSet: (exerciseTempId: string, setIndex: number) => void;
  
  updateExerciseNotes: (tempId: string, notes: string) => void;
  createSuperset: (tempIds: string[]) => void;
  removeFromSuperset: (tempId: string) => void;
  
  // Persist to database
  saveWorkout: () => Promise<void>;
  
  // Load existing workout
  loadWorkout: (workoutId: string) => Promise<void>;
}



export const useWorkoutStore = create<WorkoutState>((set, get) => ({
  isActive: false,
  workoutId: null,
  workoutName: '',
  startTime: null,
  exercises: [],

  startWorkout: async (name?: string) => {
    const workoutName = name || `Workout ${new Date().toLocaleDateString()}`;
    const startTime = new Date();
    
    // Create workout in database
    let workoutId = '';
    await database.write(async () => {
      const workout = await workoutsCollection.create((w) => {
        w.name = workoutName;
        w.date = startTime;
        w.startTime = startTime;
        w.isCompleted = false;
      });
      workoutId = workout.id;
    });

    set({
      isActive: true,
      workoutId,
      workoutName,
      startTime,
      exercises: [],
    });
    
    return workoutId;
  },

  endWorkout: async () => {
    const { workoutId, exercises } = get();
    if (!workoutId) return;

    await get().saveWorkout();

    // Mark workout as completed
    await database.write(async () => {
      const workout = await workoutsCollection.find(workoutId);
      await workout.update((w) => {
        w.isCompleted = true;
        w.endTime = new Date();
      });
    });

    // Reset state
    set({
      isActive: false,
      workoutId: null,
      workoutName: '',
      startTime: null,
      exercises: [],
    });
  },

  discardWorkout: async () => {
    const { workoutId } = get();
    
    if (workoutId) {
      await database.write(async () => {
        const workout = await workoutsCollection.find(workoutId);
        await workout.destroyPermanently();
      });
    }

    set({
      isActive: false,
      workoutId: null,
      workoutName: '',
      startTime: null,
      exercises: [],
    });
  },

  addExercise: (exerciseId, exerciseName, defaultRestSeconds = 90) => {
    const { exercises } = get();
    const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const newExercise: ActiveExercise = {
      tempId,
      exerciseId,
      exerciseName,
      order: exercises.length,
      restSeconds: defaultRestSeconds,
      sets: [
        {
          setNumber: 1,
          setType: 'normal',
          reps: 0,
          weight: 0,
          weightUnit: 'kg',
          isCompleted: false,
          restSecondsPlanned: defaultRestSeconds,
        },
      ],
    };

    set({ exercises: [...exercises, newExercise] });
  },

  removeExercise: (tempId) => {
    const { exercises } = get();
    const filtered = exercises.filter((e) => e.tempId !== tempId);
    // Reorder remaining exercises
    const reordered = filtered.map((e, i) => ({ ...e, order: i }));
    set({ exercises: reordered });
  },

  reorderExercises: (fromIndex, toIndex) => {
    const { exercises } = get();
    const result = [...exercises];
    const [removed] = result.splice(fromIndex, 1);
    result.splice(toIndex, 0, removed);
    const reordered = result.map((e, i) => ({ ...e, order: i }));
    set({ exercises: reordered });
  },

  addSet: (exerciseTempId) => {
    const { exercises } = get();
    const updated = exercises.map((exercise) => {
      if (exercise.tempId !== exerciseTempId) return exercise;
      
      const lastSet = exercise.sets[exercise.sets.length - 1];
      const newSet: ActiveSet = {
        setNumber: exercise.sets.length + 1,
        setType: 'normal',
        reps: lastSet?.reps || 0,
        weight: lastSet?.weight || 0,
        weightUnit: lastSet?.weightUnit || 'kg',
        isCompleted: false,
        restSecondsPlanned: exercise.restSeconds,
      };
      
      return { ...exercise, sets: [...exercise.sets, newSet] };
    });
    
    set({ exercises: updated });
  },

  updateSet: (exerciseTempId, setIndex, updates) => {
    const { exercises } = get();
    const updated = exercises.map((exercise) => {
      if (exercise.tempId !== exerciseTempId) return exercise;
      
      const updatedSets = exercise.sets.map((s, i) => 
        i === setIndex ? { ...s, ...updates } : s
      );
      
      return { ...exercise, sets: updatedSets };
    });
    
    set({ exercises: updated });
  },

  removeSet: (exerciseTempId, setIndex) => {
    const { exercises } = get();
    const updated = exercises.map((exercise) => {
      if (exercise.tempId !== exerciseTempId) return exercise;
      
      const filteredSets = exercise.sets.filter((_, i) => i !== setIndex);
      const renumbered = filteredSets.map((s, i) => ({ ...s, setNumber: i + 1 }));
      
      return { ...exercise, sets: renumbered };
    });
    
    set({ exercises: updated });
  },

  completeSet: (exerciseTempId, setIndex) => {
    get().updateSet(exerciseTempId, setIndex, { isCompleted: true });
  },

  updateExerciseNotes: (tempId, notes) => {
    const { exercises } = get();
    const updated = exercises.map((e) =>
      e.tempId === tempId ? { ...e, notes } : e
    );
    set({ exercises: updated });
  },

  createSuperset: (tempIds) => {
    const { exercises } = get();
    const supersetGroup = Date.now(); // Unique group ID
    
    const updated = exercises.map((e, index) => {
      if (tempIds.includes(e.tempId)) {
        return { 
          ...e, 
          supersetGroup,
          // Order within superset based on position in tempIds array
          supersetOrder: tempIds.indexOf(e.tempId),
        };
      }
      return e;
    });
    
    set({ exercises: updated });
  },

  removeFromSuperset: (tempId) => {
    const { exercises } = get();
    const updated = exercises.map((e) =>
      e.tempId === tempId 
        ? { ...e, supersetGroup: undefined, supersetOrder: undefined }
        : e
    );
    set({ exercises: updated });
  },

  saveWorkout: async () => {
    const { workoutId, exercises } = get();
    if (!workoutId) return;

    await database.write(async () => {
      for (const exercise of exercises) {
        // Create or update WorkoutExercise
        let workoutExercise: WorkoutExercise;
        
        if (exercise.id) {
          workoutExercise = await workoutExercisesCollection.find(exercise.id);
          await workoutExercise.update((we) => {
            we.order = exercise.order;
            we.notes = exercise.notes || '';
            we.supersetGroup = exercise.supersetGroup;
            we.restSeconds = exercise.restSeconds;
          });
        } else {
          workoutExercise = await workoutExercisesCollection.create((we) => {
            we.workoutId = workoutId;
            we.exerciseId = exercise.exerciseId;
            we.order = exercise.order;
            we.notes = exercise.notes || '';
            we.supersetGroup = exercise.supersetGroup;
            we.restSeconds = exercise.restSeconds;
          });
        }

        // Save sets
        for (const activeSet of exercise.sets) {
          if (activeSet.id) {
            const existingSet = await setsCollection.find(activeSet.id);
            await existingSet.update((s) => {
              s.setNumber = activeSet.setNumber;
              s.setType = activeSet.setType;
              s.reps = activeSet.reps;
              s.weight = activeSet.weight;
              s.weightUnit = activeSet.weightUnit;
              s.rpe = activeSet.rpe;
              s.isCompleted = activeSet.isCompleted;
              s.restSecondsPlanned = activeSet.restSecondsPlanned;
            });
          } else {
            await setsCollection.create((s) => {
              s.workoutExerciseId = workoutExercise.id;
              s.setNumber = activeSet.setNumber;
              s.setType = activeSet.setType;
              s.reps = activeSet.reps;
              s.weight = activeSet.weight;
              s.weightUnit = activeSet.weightUnit;
              s.rpe = activeSet.rpe;
              s.isCompleted = activeSet.isCompleted;
              s.restSecondsPlanned = activeSet.restSecondsPlanned;
            });
          }
        }
      }
    });
  },

  loadWorkout: async (workoutId) => {
    // Implementation for resuming a workout
    // TODO: Load from database and populate state
  },
}));

