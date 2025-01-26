import React from 'react';
import { View, Text, StyleSheet, Button, Image } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Welcome to My App</Text>
      </View>

      {/* Image Section */}
      <Image
        style={styles.image}
        source={{
          uri: 'https://via.placeholder.com/300x150.png?text=Welcome+Banner',
        }}
      />

      {/* Content Section */}
      <View style={styles.content}>
        <Text style={styles.title}>Get Started</Text>
        <Text style={styles.subtitle}>
          Explore features and track your daily progress!
        </Text>
        <View style={styles.buttonContainer}>
          <Button title="Learn More" onPress={() => {}} color="#4CAF50" />
        </View>
      </View>

      {/* Footer Section */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Made with ❤️ by Vindhyadevi</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6200ea',
    marginTop: 27,
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 20,
  },
  content: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#4CAF50',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    width: '80%',
  },
  footer: {
    marginTop: 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#888',
  },
});
