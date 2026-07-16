import { router, Slot } from 'expo-router'
import { onAuthStateChanged, User } from 'firebase/auth'
import { useEffect, useState } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { auth } from '../firebase/config'

export default function RootLayout() {
  const [user, setUser] = useState<User | null>(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setChecking(false)
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (checking) return

    if (user) {
      router.replace('/(tabs)/feed')
    } else {
      router.replace('/auth/phone')
    }
  }, [user, checking])

  if (checking) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#2D6A4F" />
      </View>
    )
  }

  return <Slot />
}