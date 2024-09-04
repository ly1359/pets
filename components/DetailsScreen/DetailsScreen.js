import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { formatDate } from '../../utils/formatDate';
import { useNavigation, useRoute } from '@react-navigation/native';
import PetImage from '../HomeScreen/PetImage';
import db from '../../database/db';

const DetailsScreen = () => {
  const route = useRoute();
  const { pet } = route.params;
  const navigation = useNavigation();

  const removePet = async (pet) => {
    const statement = await (await db).prepareAsync(`DELETE FROM pets WHERE id = ?;`);
    await statement.executeAsync([pet.id]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <PetImage item={pet} size={200} />
      </View>
      <View style={styles.containerText}>
        <Text style={styles.textName}>{pet.name}</Text>
        <Text style={styles.label}>Tipo: </Text>
        <Text style={styles.text}>{pet.type}</Text>
        <Text style={styles.label}>Data de Nascimento: </Text>
        <Text style={styles.text}>{formatDate(pet.bDate)}</Text>
        <Text style={styles.label}>Vacinas: </Text>
        <Text style={styles.text}>{pet.vaccines || 'Não informado'}</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={async () => {
              await removePet(pet);
              navigation.goBack();
            }}
            style={styles.removeButton}
          >
            <Text style={{color: 'white', textAlign: 'center'}}>Remover</Text>
          </TouchableOpacity>
        </View>
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
  imageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '50%',
  },
  buttonContainer: {
    padding: 20,
  },
  removeButton: {
    flex: 0,
    backgroundColor: '#AF0000',
    padding: 15,
    textAlign: 'center',
    borderRadius: 25,
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