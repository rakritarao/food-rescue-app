import { Stack, router } from 'expo-router'
import { onAuthStateChanged } from 'firebase/auth'
import { useEffect, useState } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { auth } from '../../firebase/config'

export default function RootLayout() {
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace('/(tabs)/feed')
      } else {
        router.replace('/auth/phone')
      }
      setChecking(false)
    })

    return () => unsubscribe()
  }, [])

  if (checking) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#2D6A4F" />
      </View>
    )
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="auth/phone" />
      <Stack.Screen name="auth/verify" />
      <Stack.Screen name="auth/role" />
    </Stack>
  )
}