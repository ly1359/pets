import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import * as FileSystem from 'expo-file-system';
import { setupDatabase, getDatabase, getPetIdByName } from '../../database/db';
import { useNavigation, useRoute } from '@react-navigation/native';
import ErrorModal from './ErrorModal';

const AddPetScreen = () => {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [otherType, setOtherType] = useState('');
  const [bDate, setbDate] = useState(new Date());
  const [vaccines, setVaccines] = useState([{ vaccineName: '', vaccineDate: new Date() }]);;
  const [showDatePickerIndex, setShowDatePickerIndex] = useState(null);
  const [image, setImage] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const db = getDatabase();

  const addVaccineField = () => {
    setVaccines([...vaccines, { name: '', vaccineDate: new Date() }]);
  };

  const updateVaccine = (index, field, value) => {
    const updatedVaccines = vaccines.map((vaccine, i) => 
      i === index ? { ...vaccine, [field]: value } : vaccine
    );
    setVaccines(updatedVaccines);
  };

  const handleDateChange = (index, event, selectedDate) => {
    const updatedVaccines = [...vaccines];
    if (selectedDate) {
      updatedVaccines[index].vaccineDate = selectedDate;
    }
    setVaccines(updatedVaccines);
    setShowDatePickerIndex(null);
  };

  useEffect(() => {
    setupDatabase();
  }, []);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const { uri } = result.assets[0];
      const newPath = `${FileSystem.documentDirectory}${Date.now()}.jpg`;
      await FileSystem.copyAsync({
        from: uri,
        to: newPath,
      });
      setImage(newPath);
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      alert("Permission to access camera is required!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const { uri } = result.assets[0];
      const newPath = `${FileSystem.documentDirectory}${Date.now()}.jpg`;
      await FileSystem.copyAsync({
        from: uri,
        to: newPath,
      });
      setImage(newPath);
    }
  };

  const [modalVisible, setModalVisible] = useState(false);
  const petType = type === 'Outro' ? otherType : type;

  const validate = () => {
    if (!name || !petType || !bDate) {
      return false;
    }

    return true;
  };

  const savePet = async () => {
    if (!validate()) {
      setModalVisible(true);
      return;
    }

    try {
      let insertPetStatement
      const petStatementValues = [name.toString(), petType.toString(), otherType.toString(), bDate.toISOString()];

      if (image === null) {
        insertPetStatement = await (await db).prepareAsync(
          `INSERT INTO pets (name, type, otherType, bDate) 
          VALUES (?, ?, ?, ?);`
        );
      } else {
        insertPetStatement = await (await db).prepareAsync(
          `INSERT INTO pets (name, type, otherType, bDate, image) 
          VALUES (?, ?, ?, ?, ?);`
        );

        petStatementValues.push(image.toString());
      }

      await insertPetStatement.executeAsync(petStatementValues);
      await insertPetStatement.finalizeAsync();

      const petId = await getPetIdByName(name.toString());

      if(petId && vaccines.length > 0) {
        for (const vaccine of vaccines){
          const insertVaccinesStatement = await (await db).prepareAsync(
            `INSERT INTO vaccines (petId, vaccineName, vaccineDate) 
            VALUES (?, ?, ?);`
          );
          await insertVaccinesStatement.executeAsync([
            petId, vaccine.vaccineName , vaccine.vaccineDate.toISOString()
          ]);
          await insertVaccinesStatement.finalizeAsync();
        }
      }
   
      if(route.params?.onSave) {
       
        route.params.onSave();
        navigation.goBack();
      } else {
        console.log('Error v saving pet:', result);
      }
    } catch (error) {
        console.error('Error saving pet', error);
    }
  
  };

  return (
    <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  >
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <ErrorModal visible={modalVisible} setVisible={setModalVisible} />
        <Text style={styles.title}>Cadastre o animal</Text>

        {image && <Image source={{ uri: image }} style={styles.image} />}
          <TouchableOpacity onPress={pickImage} style={styles.button}>
            <Text style={{color: '#3C3C3C', textAlign: 'center'}}>Escolher Imagem</Text>
          </TouchableOpacity>
        
        <Text style={styles.label}>Nome:</Text>
        <TextInput
          style={styles.input}
          placeholder="Nome"
          value={name}
          onChangeText={setName}
        />
        <Picker
          selectedValue={type}
          style={styles.picker}
          onValueChange={(itemValue) => setType(itemValue)}
        >
          <Picker.Item label="Selecione o tipo" value="" />
          <Picker.Item label="Gato" value="Gato" />
          <Picker.Item label="Cachorro" value="Cachorro" />
          <Picker.Item label="Outro" value="Outro" />
        </Picker>
        {type === 'Outro' && (
          <TextInput
            style={styles.input}
            placeholder="Especifique o tipo"
            value={otherType}
            onChangeText={setOtherType}
          />
        )}

        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
          <Text style={{color:'#3C3C3C', textAlign: 'center'}}>Escolher Data de Nascimento/Adoção</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={bDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setbDate(selectedDate || bDate);
              setShowDatePicker(false);
            }}
          />
        )}

        <Text style={styles.label}>Adicione as Vacinas:</Text>  
        {vaccines.map((vaccine, index) => (
          <View key={index}>
            <Text>Nome da Vacina:</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome da Vacina"
              value={vaccine.vaccineName}
              onChangeText={(text) => {
                const updatedVaccines = [...vaccines];
                updatedVaccines[index].vaccineName = text;
                setVaccines(updatedVaccines);
              }}
            />
            <TouchableOpacity onPress={() => setShowDatePickerIndex(index)} style={styles.dateButton}>
              <Text style={{color:'#3C3C3C', textAlign: 'center'}}>Escolher Data da Vacina</Text>
            </TouchableOpacity>

            {showDatePickerIndex === index && (
              <DateTimePicker
                value={vaccine.vaccineDate || new Date()}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => handleDateChange(index, event, selectedDate)}
              />
            )}
          </View>
        ))}

        <TouchableOpacity onPress={addVaccineField}>
          <Text style={styles.addButton}>Adicionar Outra Vacina</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>

    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.buttonSalvar} onPress={savePet}>
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>
    </View>
  </KeyboardAvoidingView>
);
};

const styles = StyleSheet.create({
scrollContainer: {
  flexGrow: 1,
},
container: {
  flex: 1,
  paddingTop: 90,
  padding: 20,
  backgroundColor: '#EAEDE3',
},
label: {
  fontWeight: 'bold',
  marginVertical: 5,
  paddingLeft: 10,
  fontSize: 16,
  color: '#555',
},
title: {
  fontSize: 24,
  color: '#3C3C3C',
  fontWeight: 'bold',
  marginTop: 20,
  textAlign: 'center',
},
input: {
  height: 40,
  borderColor: '#000',
  borderWidth: 1,
  borderRadius: 5,
  paddingHorizontal: 10,
  marginBottom: 15,
},
picker: {
  height: 50,
  width: '100%',
  color: '#545452',
  marginBottom: 15,
},
dateButton: {
  color: 'white',
  backgroundColor: '#D0DEB8',
  padding: 10,
  marginBottom: 15,
  textAlign: 'center',
  borderRadius: 5,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.8,
  shadowRadius: 2,
  elevation: 5,
},
addButton: {
  color: 'green',
  borderColor: '#000',
  marginBottom: 15,
},
button: {
  color: 'white',
  backgroundColor: '#D0DEB8',
  padding: 10,
  marginBottom: 15,
  textAlign: 'center',
  borderRadius: 5,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.8,
  shadowRadius: 2,
  elevation: 5,
},
image: {
  width: 100,
  height: 100,
  marginVertical: 15,
  alignSelf: 'center',   
},
buttonContainer: {
  padding: 20,
  backgroundColor: '#EAEDE3',
},
buttonSalvar: {
  backgroundColor: '#4CAF50',
  padding: 15,
  borderRadius: 25,
  alignItems: 'center',
  justifyContent: 'center',
},
buttonText: {
  fontSize: 18,
  color: '#fff',
  fontWeight: 'bold',
},
});

export default AddPetScreen;
