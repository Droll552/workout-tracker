import {create} from 'zustand'
import {database, userSettingsCollection} from '../database'
import UserSettings from '../database/models/UserSettings'

interface SettingsState {
    weightUnit: 'kg' | 'lbs'
    defaultRestSeconds: number
    theme: 'light' | 'dark' | 'system'
    notificationsEnabled: boolean
    isLoaded: boolean

    loadSettings: () => Promise<void>
    updateWeightUnit: (unit: 'kg' | 'lbs') => Promise<void>
    updateDefaultRest: (seconds: number) => Promise<void>
    updateTheme: (theme: 'light'| 'dark'|'system') => Promise<void> 
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
    weightUnit: 'kg',
    defaultRestSeconds: 90,
    theme: 'system',
    notificationsEnabled: true,
    isLoaded: false,

    loadSettings: async () => {
        try {
            const settings = await userSettingsCollection.query().fetch()
            if (settings.length > 0) {
                const s = settings[0]
                set ({
                    weightUnit: s.weightUnit as 'kg' | 'lbs',
                    defaultRestSeconds: s.defaultRestSeconds,
                    theme: s.theme as 'light' | 'dark' | 'system',
                    notificationsEnabled: s.notificationsEnabled,
                    isLoaded: true
                })
            }
        } catch (error) {
            console.error('Failed to load settings:', error)
        }
    },

    updateWeightUnit: async (unit) => {
        set({weightUnit: unit})
        await database.write(async () => {
            const settings = await userSettingsCollection.query().fetch()
            if(settings.length > 0) {
                await settings[0].update((s) => {
                    s.weightUnit = unit;
                })
            }
        })
    },

    updateDefaultRest: async (seconds) => {
        set ({defaultRestSeconds: seconds})
        await database.write(async ()=> {
            const settings = await userSettingsCollection.query().fetch()
            if (settings.length > 0) {
                await settings[0].update((s) => {
                    s.defaultRestSeconds = seconds
                })
            }
        })
    },

    updateTheme: async (theme) {
        set ({theme})
        await database.write(async () => {
            const settings = await userSettingsCollection.query().fetch()

            if (settings.length > 0) { 
                await settings[0].update((s) => {
                    s.theme = theme
                })
            }
        })
    },
}))