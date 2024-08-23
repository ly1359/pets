import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { formatDate } from '../../utils/formatDate';
import { useRoute } from '@react-navigation/native';

const DetailsScreen = () => {
  const route = useRoute();
  const { pet } = route.params;

  return (
    <View style={styles.container}>
      <Image source={{ uri: pet.image }} style={styles.image} />
      <View style={styles.containerText}>
        <Text style={styles.textName}>{pet.name}</Text>
        <Text style={styles.label}>Tipo: </Text>
        <Text style={styles.text}>{pet.type}</Text>
        <Text style={styles.label}>Data de Nascimento: </Text>
        <Text style={styles.text}>{formatDate(pet.bDate)}</Text>
        <Text style={styles.label}>Vacinas: </Text>
        <Text style={styles.text}>{pet.vaccines || 'Não informado'}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 35,
    backgroundColor: '#EAEDE3',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  image: {
    width: '100%',
    height: '50%',
    borderRadius: 50,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  containerText: {
    width: '100%',
    height: '50%',
    borderTopLeftRadius: 50,
    backgroundColor: '#F4F6F1',
  },

  label: {
    fontWeight: 'bold',
    marginVertical: 5, 
    paddingLeft: 10,
    fontSize: 16,
    color: '#555',
  },
  textName: {
    fontSize: 26,
    paddingTop: 10,
    paddingLeft: 10,
    color: '#777',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    paddingLeft: 10,
    color: '#777',
    marginBottom: 10,
  },
});

export default DetailsScreen;