import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colors, inter, cardShadow } from '../theme/design';
import { useAppSettings } from '../context/AppSettingsContext';

export default function ButtonPrimary({
  title,
  onPress,
  disabled = false,
  variant = 'primary',
  style,
}) {
  const { appColors } = useAppSettings();
  const isOutline = variant === 'outline';
  const isAccent = variant === 'accent';
  return (
    <TouchableOpacity
      style={[
        styles.btn,
        isOutline && styles.outline,
        !isOutline && !isAccent && { backgroundColor: '#A3E635' },
        !isOutline && isAccent && { backgroundColor: appColors.accent },
        isOutline && {
          backgroundColor: '#FFFFFF',
          borderWidth: 2.2,
          borderColor: '#0F172A',
        },
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
    >
      <Text
        style={[
          styles.label,
          !isOutline && !isAccent && { color: '#0F172A' },
          isOutline && { color: '#0F172A' },
          isAccent && !isOutline && { color: appColors.onSecondary },
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.2,
    borderColor: '#0F172A',
    ...cardShadow(),
  },
  filled: {
    backgroundColor: colors.primary,
  },
  accentFilled: {
    backgroundColor: colors.accent,
  },
  outline: {
    backgroundColor: colors.card,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    ...inter.bold,
    color: '#FFFFFF',
    fontSize: 16,
  },
  labelOnAccent: {
    color: '#FFFDF8',
  },
  labelOutline: {
    color: colors.primary,
  },
});
