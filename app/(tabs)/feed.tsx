import { addDoc, collection, getDocs } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { db } from '../../firebase/config'

export default function FeedScreen() {
  const [status, setStatus] = useState('Connecting to Firebase...')

  useEffect(() => {
    async function testConnection() {
      try {
        // write a test document
        await addDoc(collection(db, 'test'), {
          message: 'Firebase is connected!',
          timestamp: new Date()
        })

        // read it back
        const snapshot = await getDocs(collection(db, 'test'))
        const count = snapshot.docs.length

        setStatus(`✅ Firebase connected! ${count} document(s) in test collection.`)
      } catch (error: any) {
        setStatus(`❌ Error: ${error.message}`)
      }
    }

    testConnection()
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.status}>{status}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  status: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    lineHeight: 24,
  },
})