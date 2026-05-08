import { Image, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/design';

const EMOJIS = ['🍵', '☕', '🍜', '🍔', '🍙', '🧋', '🥟', '🍰', '🥤', '🍱'];

function emojiForProduct(id) {
  let h = 0;
  const s = String(id);
  for (let i = 0; i < s.length; i++) {
    h += s.charCodeAt(i);
  }
  return EMOJIS[h % EMOJIS.length];
}

export default function ProductThumb({ imageUri, emoji, productId, size = 52 }) {
  const radius = Math.round(size * 0.27);
  const wrap = [styles.wrap, { width: size, height: size, borderRadius: radius }];
  if (imageUri && String(imageUri).trim()) {
    return (
      <View style={wrap}>
        <Image
          source={{ uri: String(imageUri).trim() }}
          style={[styles.img, { width: size, height: size }]}
          resizeMode="cover"
        />
      </View>
    );
  }
  const custom =
    emoji != null && String(emoji).trim() ? String(emoji).trim() : null;
  const shown = custom || emojiForProduct(productId);
  return (
    <View style={wrap}>
      <Text style={[styles.emoji, { fontSize: Math.round(size * 0.5) }]}>
        {shown}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.mintIconBg,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  img: {},
  emoji: {},
});
