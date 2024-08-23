import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import * as FileSystem from 'expo-file-system';
import { setupDatabase, getDatabase } from '../../database/db';
import { useNavigation, useRoute } from '@react-navigation/native';


const AddPetScreen = () => {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [otherType, setOtherType] = useState('');
  const [bDate, setbDate] = useState(new Date());
  const [vaccines, setVaccines] = useState('');
  const [image, setImage] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const db = getDatabase();

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

  const savePet = async () => {
    const petType = type === 'Outro' ? otherType : type;
    try {
      const result = await (await db).prepareAsync(
        `INSERT INTO pets (name, type, otherType, bDate, vaccines, image) 
        VALUES (?, ?, ?, ?, ?, ?);`

      );
      await result.executeAsync([
        name.toString(), petType.toString(), otherType.toString(), bDate.toISOString(), vaccines.toString(), image.toString()
      ]);
      await result.finalizeAsync();

   
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
    <View style={styles.container}>
      <Text style={styles.title}>Cadastrar Animal</Text>
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

      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <Text style={styles.dateButton}>Escolher Data de Nascimento/Adoção</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={bDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            const currentDate = selectedDate || bDate;
            setShowDatePicker(false);
            setbDate(currentDate);
          }}
        />
      )}
      <Text style={styles.label}>Adicione as Vacinas:</Text>
      <TextInput
        style={styles.input}
        placeholder="Vacinas"
        value={vaccines}
        onChangeText={setVaccines}
      />

      <TouchableOpacity onPress={pickImage}>
        <Text style={styles.button}>Escolher Imagem</Text>
      </TouchableOpacity>

      {image && <Image source={{ uri: image }} style={styles.image} />}

      <TouchableOpacity style={styles.buttonSalvar} onPress={savePet}>
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
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
    color: 'blue',
    marginBottom: 15,
  },
  button: {
    color: 'blue',
    marginBottom: 15,
  },
  image: {
    width: 100,
    height: 100,
    marginVertical: 15,   
  },
  buttonSalvar: {
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

export default AddPetScreen;
