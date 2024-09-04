import React from 'react';
import { Image, StyleSheet, View, Text } from 'react-native';

const PetImage = ({ item }) => {
    return (
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.image ?? 'https://via.placeholder.com/100' }}
          style={styles.image}
        />
      </View>
    );
};

const styles = StyleSheet.create({
  imageContainer: {
    maxWidth: 150,
    maxHeight: 150,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
});

export default PetImage;
