import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';

// Main tab navigator params
export type MainTabParamList = {
    Home: undefined
    Workout: undefined
    Exercises: undefined
    History: undefined
    Profile: undefined
}

export type HomeStackParaList = {
    HomeScreen: undefined
}

export type WorkoutStackParamList = {
    WorkoutHome: undefined
    ActiveWorkout: {templateId?: string; workoutId?: string}
    SelectExercise: {workoutId: string}
    ExerciseDetail: {exerciseId: string}
}

export type ExercisesStackParamList = {
    ExerciseLibrary: undefined
    ExerciseDetail: {exerciseId:string}
    CreateExercise: undefined
}

export type HistoryStackParamList = {
    HistoryList: undefined
    WorkoutDetail: {workoutId: string}
}

export type ProfileStackparamList = {
    ProfileHome: undefined
    Settings: undefined
    Templates: undefined
    TemplateDetail: {templateId: string}
    CreateTemplate: undefined
}

//Root stack (for modals, auth, etc.)
export type RootStackParamList = {
    MainTabs: NavigatorScreenParams<MainTabParamList>
    RestTimerModal: {seconds: number; exerciseName: string}
}

//Screen prop types
export type RootStackScreenProps<T extends keyof RootStackParamList> = 
  NativeStackScreenProps<RootStackParamList, T>;

export type MainTabScreenProps<T extends keyof MainTabParamList> = 
  CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;
