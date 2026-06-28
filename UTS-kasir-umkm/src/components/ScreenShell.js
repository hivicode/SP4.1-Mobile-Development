import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/design';
import { useAppSettings } from '../context/AppSettingsContext';

export default function ScreenShell({ children }) {
  const { appColors } = useAppSettings();

  return (
    <SafeAreaView
      style={[styles.root, { backgroundColor: appColors.pageBg }]}
      edges={['bottom', 'left', 'right']}
    >
      <View style={styles.content}>
        {children}
      </View>
      <LinearGradient
        colors={['#BEF264', 'transparent']}
        style={styles.bottomGradient}
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }}
        pointerEvents="none"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.pageBg,
    position: 'relative',
  },
  content: {
    flex: 1,
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
  },
});
