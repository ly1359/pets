import React from 'react';
import { Dimensions, StyleSheet, Pressable, View, Text, Modal } from 'react-native';

const ErrorModal = ({ visible, setVisible }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => setVisible(!visible)}>
      <View style={styles.modalView}>
        <View style={styles.modalTextContainer}>
          <Text style={styles.modalText}>Preencha todos os dados!</Text>
          <Pressable
            style={[styles.modalButton, styles.button]}
            onPress={() => setVisible(!visible)}>
            <Text style={styles.textStyle}>Okay</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  )
};

const styles = StyleSheet.create({
  modalView: {
    height: Dimensions.get('screen').height,
    width: Dimensions.get('screen').width,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000AA',
  },
  modalTextContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    gap: 25,
    padding: 25,
    borderRadius: 20,
  },
  modalText: {
    fontSize: 24,
    color: '#AF0000',
    fontWeight: 'bold',
    textAlign: 'center',
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
});

export default ErrorModal;
