import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, Text } from 'react-native';

export default function RootLayout() {
  return (
    <Tabs
    screenOptions={{
        tabBarActiveTintColor: '#1a73e8', // Google Blue
        tabBarInactiveTintColor: '#5f6368',
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
        headerTitleAlign: 'center',
      }}
    >
      <Tabs.Screen
      name="index"
      options={{
        headerTitle: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#4285F4' }}>G</Text>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#EA4335' }}>o</Text>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#FBBC05' }}>o</Text>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#4285F4' }}>g</Text>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#34A853' }}>l</Text>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#EA4335' }}>e</Text>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#202124' }}> News</Text>
            </View>
          ),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="newspaper-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
      name="saved"
      options={{
        title: 'Saved',
        tabBarIcon: ({ color, size }) => (
            <Ionicons name="bookmark-outline" size={size} color={color} />
          ),
      }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          href: null, //Hides explore
        }}
      />
      <Tabs.Screen
      name="details"
      options={{
        href: null, //Hides 'details' from the bottom tab bar
        title: 'Article Details',
      }}
      />
    </Tabs>
  );
}