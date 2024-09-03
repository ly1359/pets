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
  if (item.image) {
    return (
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.image }}
          style={styles.image}
        />
      </View>
    )
  }

  if (item.type === 'Outro') {
    return (
      <View style={styles.imageContainer}>
        <Image
          source={'https://via.placeholder.com/100'}
          style={styles.image}
        />
      </View>
    )
  }

  const svg = avatar(typeToSeed[item.type], { size });

  return (
    <View style={styles.imageContainer}>
      <Text>
        <SvgXml xml={svg} width={size} height={size} />
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: DEFAULT_SIZE,
    marginBottom: 15,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
});

export default PetImage;
