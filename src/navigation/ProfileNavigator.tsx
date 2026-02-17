import ProfileHomeScreen from '../screens/profile/ProfileHomeScreen';
import TemplatesScreen from '../screens/profile/TemplatesScreen';
import SettingsScreen from '../screens/profile/SettingsScreen';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export default function ProfileNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ProfileHome" 
        component={ProfileHomeScreen}
        options={{ title: 'Profile' }}
      />
      <Stack.Screen 
        name="Templates" 
        component={TemplatesScreen}
        options={{ title: 'Templates' }}
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
    </Stack.Navigator>
  );
}