import * as Notifications from 'expo-notifications'
import { router, Slot } from 'expo-router'
import { onAuthStateChanged, User } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { ActivityIndicator, Alert, Platform, View } from 'react-native'
import { auth, db } from '../firebase/config'

async function registerPushToken(userId: string) {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }

    if (finalStatus !== 'granted') return

    const token = await Notifications.getExpoPushTokenAsync({
      projectId: '06bf8adb-5737-4581-a8bf-f96efd737fef'
    })

    await setDoc(doc(db, 'users', userId), {
      pushToken: token.data,
      platform: Platform.OS,
    }, { merge: true })

    console.log('Push token saved:', token.data)

  } catch (error: any) {
    Alert.alert('Push token error', error.message)
  }
}

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
      registerPushToken(user.uid)
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