import React from 'react';
import { Image, StyleSheet, View, Text } from 'react-native';
import avatar from 'animal-avatar-generator';
import { SvgXml } from 'react-native-svg';

const DEFAULT_SIZE = 150;

// `nextjs-animal-avatar-generator` doesn't support getting a specific animal,
// so we need to work around it...
const typeToSeed = {
  Gato: 'aaaaaaa',
  Cachorro: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
};

const PetImage = ({ item, size = DEFAULT_SIZE }) => {
  const width = size;
  const height = size;

  if (item.image) {
    return (
      <View style={[styles.imageContainer, { width, height }]}>
        <Image
          source={{ uri: item.image }}
          style={styles.image}
        />
      </View>
    )
  }

  const unknownType = Object.keys(typeToSeed).findIndex((v) => v === item.type) === -1;

  if (unknownType) {
    return (
      <View style={[styles.imageContainer, { width, height }]}>
        <Image
          source={{ uri: 'https://via.placeholder.com/100' }}
          style={styles.image}
        />
      </View>
    )
  }

  const svg = avatar(typeToSeed[item.type], { size });

  return (
    <View style={[styles.imageContainer, { width, height }]}>
      <Text>
        <SvgXml xml={svg} width={size} height={size} />
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
});

export default PetImage;
