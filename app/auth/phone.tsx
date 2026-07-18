import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha'
import { router } from 'expo-router'
import { PhoneAuthProvider } from 'firebase/auth'
import { useRef, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import AppLogo from '../../components/AppLogo'
import { auth } from '../../firebase/config'

export default function PhoneScreen() {
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const recaptchaVerifier = useRef(null)

  async function handleSendOTP() {
    if (!phone || phone.length < 10) {
      Alert.alert('Invalid number', 'Please enter a valid phone number with country code.')
      return
    }

    setLoading(true)
    try {
      const provider = new PhoneAuthProvider(auth)
      const verificationId = await provider.verifyPhoneNumber(
        phone,
        recaptchaVerifier.current!
      )

      router.push({
        pathname: '/auth/verify',
        params: { verificationId }
      })

    } catch (error: any) {
      Alert.alert('Error', error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <FirebaseRecaptchaVerifierModal
          ref={recaptchaVerifier}
          firebaseConfig={auth.app.options}
        />

        <View style={styles.logoContainer}>
          <AppLogo size={100} />
          <Text style={styles.appName}>Food Rescue</Text>
          <Text style={styles.tagline}>Nourish · Connect · Sustain</Text>
        </View>

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="+91 98765 43210"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          autoFocus
        />
        <Text style={styles.hint}>Include country code (e.g. +91 for India, +1 for US)</Text>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSendOTP}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Send OTP</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  container: {
    flexGrow: 1,
    padding: 28,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  appName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2D6A4F',
    marginTop: 12,
    marginBottom: 4,
  },
  tagline: {
    fontSize: 12,
    color: '#52B788',
    letterSpacing: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  hint: {
    fontSize: 12,
    color: '#999',
    marginBottom: 28,
  },
  button: {
    backgroundColor: '#2D6A4F',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
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