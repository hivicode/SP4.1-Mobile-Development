import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/design';
import { useAppSettings } from '../context/AppSettingsContext';

export default function ScreenShell({ children }) {
  const { appColors } = useAppSettings();
  return (
    <SafeAreaView
      style={[styles.root, { backgroundColor: appColors.pageBg }]}
      edges={['bottom', 'left', 'right']}
    >
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.pageBg,
  },
});
