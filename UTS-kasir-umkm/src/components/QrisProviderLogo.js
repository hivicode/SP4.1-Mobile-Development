import { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import {
  getProviderFallbackTint,
  getProviderLogoUri,
  providerInitial,
} from '../utils/qrisBranding';
import { inter } from '../theme/design';

export default function QrisProviderLogo({
  providerName,
  size = 56,
  borderRadius = 12,
}) {
  const uri = getProviderLogoUri(providerName);
  const [failed, setFailed] = useState(false);

  const showRemote = uri && !failed;
  const tint = getProviderFallbackTint(providerName);
  const letter = providerInitial(providerName);

  const wrap = [
    styles.wrap,
    {
      width: size,
      height: size,
      borderRadius,
      ...(showRemote ? {} : { backgroundColor: tint }),
    },
  ];

  return (
    <View style={wrap}>
      {showRemote ? (
        <Image
          source={{ uri }}
          style={{ width: size, height: size, borderRadius }}
          resizeMode="contain"
          onError={() => setFailed(true)}
        />
      ) : (
        <Text style={[styles.mono, { fontSize: Math.round(size * 0.42) }]}>
          {letter}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  mono: {
    ...inter.extraBold,
    color: '#FFFFFF',
  },
});
