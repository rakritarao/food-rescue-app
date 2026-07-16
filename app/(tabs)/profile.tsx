import { router } from 'expo-router'
import { signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { auth, db } from '../../firebase/config'

type UserProfile = {
  phone: string
  role: 'restaurant' | 'ngo'
  createdAt: any
}

export default function ProfileScreen() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProfile() {
      try {
        const user = auth.currentUser
        if (!user) return

        const userSnap = await getDoc(doc(db, 'users', user.uid))
        if (userSnap.exists()) {
          setProfile(userSnap.data() as UserProfile)
        }
      } catch (error: any) {
        Alert.alert('Error', error.message)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  async function handleSignOut() {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await signOut(auth)
            router.replace('/auth/phone')
          }
        }
      ]
    )
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2D6A4F" />
      </View>
    )
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {profile?.role === 'restaurant' ? '🍽' : '🤝'}
          </Text>
        </View>
        <Text style={styles.phone}>{auth.currentUser?.phoneNumber}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>
            {profile?.role === 'restaurant' ? 'Restaurant' : 'NGO / Shelter'}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Details</Text>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Role</Text>
          <Text style={styles.rowValue}>
            {profile?.role === 'restaurant' ? 'Restaurant' : 'NGO / Shelter'}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Phone</Text>
          <Text style={styles.rowValue}>{auth.currentUser?.phoneNumber}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Status</Text>
          <Text style={[styles.rowValue, { color: '#2D6A4F' }]}>Active</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            {profile?.role === 'restaurant'
              ? '🍽 As a restaurant, you can post surplus food listings that NGOs and shelters can claim for free.'
              : '🤝 As an NGO, you can browse available food listings and claim them for pickup to distribute to people in need.'}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    padding: 24,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 36,
  },
  phone: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  roleBadge: {
    backgroundColor: '#2D6A4F',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  roleText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  rowLabel: {
    fontSize: 15,
    color: '#666',
  },
  rowValue: {
    fontSize: 15,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  infoBox: {
    backgroundColor: '#F0F7F4',
    borderRadius: 10,
    padding: 14,
  },
  infoText: {
    fontSize: 14,
    color: '#444',
    lineHeight: 22,
  },
  signOutButton: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#E53935',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 32,
  },
  signOutText: {
    color: '#E53935',
    fontSize: 16,
    fontWeight: '700',
  },
})