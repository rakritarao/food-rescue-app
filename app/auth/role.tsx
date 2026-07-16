import * as Notifications from 'expo-notifications'
import { router, useLocalSearchParams } from 'expo-router'
import { doc, setDoc } from 'firebase/firestore'
import { useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { db } from '../../firebase/config'

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

  } catch (error: any) {
    console.log('Push token error:', error.message)
  }
}

export default function RoleScreen() {
  const { uid } = useLocalSearchParams<{ uid: string }>()
  const [selected, setSelected] = useState<'restaurant' | 'ngo' | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleContinue() {
    if (!selected) {
      Alert.alert('Please select a role to continue.')
      return
    }

    setLoading(true)
    try {
      if (!uid) {
        Alert.alert('Session expired', 'Please sign in again.')
        router.replace('/auth/phone')
        return
      }

      await setDoc(doc(db, 'users', uid), {
        role: selected,
        createdAt: new Date(),
        verified: false,
      })

      await registerPushToken(uid)
      router.replace('/(tabs)/feed')

    } catch (error: any) {
      Alert.alert('Error', error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>I am a...</Text>
      <Text style={styles.subtitle}>
        This helps us show you the right experience
      </Text>

      <TouchableOpacity
        style={[styles.card, selected === 'restaurant' && styles.cardSelected]}
        onPress={() => setSelected('restaurant')}
      >
        <Text style={styles.cardIcon}>🍽</Text>
        <Text style={styles.cardTitle}>Restaurant</Text>
        <Text style={styles.cardDesc}>I have surplus food to donate</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.card, selected === 'ngo' && styles.cardSelected]}
        onPress={() => setSelected('ngo')}
      >
        <Text style={styles.cardIcon}>🤝</Text>
        <Text style={styles.cardTitle}>NGO / Shelter</Text>
        <Text style={styles.cardDesc}>I collect food for people in need</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, (!selected || loading) && styles.buttonDisabled]}
        onPress={handleContinue}
        disabled={!selected || loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Continue</Text>
        )}
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 28,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2D6A4F',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 36,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#eee',
    alignItems: 'center',
  },
  cardSelected: {
    borderColor: '#2D6A4F',
    backgroundColor: '#F0F7F4',
  },
  cardIcon: {
    fontSize: 36,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#2D6A4F',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#8fbc8f',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
})