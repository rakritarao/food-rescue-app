import { View, Text, StyleSheet } from 'react-native'

export default function FeedScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Available listings will appear here</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    color: '#666',
  },
})