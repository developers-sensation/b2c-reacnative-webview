import React from 'react'
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = ({ route }) => {
  const navigation = useNavigation();
  const tokens = route.params;

  return (
    <View style={styles.container}>
      {tokens && tokens.accessToken ? (
        <ScrollView contentContainerStyle={styles.scrollStyle}>
          <Text style={styles.textStyle}>Login Successful</Text>
          <Pressable
            style={styles.buttonStyles}
            onPress={() => navigation.navigate('Home')}>
            <Text style={styles.textStyle}>Logout</Text>
          </Pressable>
        </ScrollView>) :
        (
          <Pressable
            style={styles.buttonStyles}
            onPress={() => navigation.navigate('B2CLogin')}>
            <Text style={styles.textStyle}>B2CLogin</Text>
          </Pressable>
        )}
    </View>
  );
}
export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textStyle: {
    padding: 10,
    fontSize: 20
  },
  scrollStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 25
  },
  buttonStyles: {
    paddingVertical: 10,
    paddingHorizontal: 40,
    backgroundColor: "orange"
  }
})