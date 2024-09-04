import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, Button } from 'react-native';
import { formatDate } from '../../utils/formatDate';
import { setupDatabase, getDatabase } from '../../database/db';
import { useNavigation } from '@react-navigation/native';
import PetImage from './PetImage';

const HomeScreen = () => {
  const [pets, setPets] = useState([]);
  const navigation = useNavigation();
  const db = getDatabase();

  const fetchPets = async () => {
    const statement = await (await db).prepareAsync('SELECT * FROM pets;');
    const result = await statement.executeAsync();
    const rows = await result.getAllAsync();
    await statement.finalizeAsync();

    const statementVaccines = await (await db).prepareAsync('SELECT * FROM vaccines;');
    const resultVaccinse = await statementVaccines.executeAsync();
    const rowsVaccines = await resultVaccinse.getAllAsync();
    await statementVaccines.finalizeAsync();

    const petsWithVaccines = rows.map(pet => {
      const petVaccines = rowsVaccines.filter(vaccine => vaccine.petId === pet.id);
      return {
        ...pet,
        vaccines: petVaccines.length > 0 ? petVaccines.map(v => `${v.vaccineName}`).join(', ') : 'Não informado',
      };
    });
  
    setPets(petsWithVaccines);
  };

  useEffect(() => {
    setupDatabase();
    fetchPets();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchPets();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <FlatList 
        data={pets}
        keyExtractor={(item) => item.id.toString()} 
        renderItem={({ item }) => (
          <TouchableOpacity 
            onPress={() => navigation.navigate('Details', { pet: item })} 
            style={styles.petContainer}
          >
            <PetImage item={item} />

            <View>
              <Text style={styles.name}>{item.name.toString()}</Text>
              <Text>Tipo: {item.type === 'Outro' ? item.otherType : item.type || 'Não informado'}</Text>
              <Text>Data de Nascimento: {formatDate(item.bDate)}</Text>
              <Text>Vacinas:  {item.vaccines || 'Não informado'}</Text>
            </View>
          </TouchableOpacity>
        )}
        numColumns={2}
      />
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Add', {onSave: fetchPets})}>
        <Text style={styles.buttonText}>Cadastrar Novo Animal</Text>
      </TouchableOpacity>
    </View>
  );  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    padding: 10,
    backgroundColor: '#d4dcc6',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  petContainer: {
    display: 'flex',
    flexDirection:'column',
    backgroundColor: '#dfe5d5',
    borderRadius: 15,
    padding: 15,
    margin: 7,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    width: '47%',
    height: 350,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  }, info: {
    fontSize: 16,
    color: '#777',
    marginBottom: 3,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 15,
    marginHorizontal: 50,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default HomeScreen;