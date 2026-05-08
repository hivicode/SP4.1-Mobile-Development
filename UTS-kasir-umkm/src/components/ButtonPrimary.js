import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colors, inter } from '../theme/design';

export default function ButtonPrimary({
  title,
  onPress,
  disabled = false,
  variant = 'primary',
  style,
}) {
  const isOutline = variant === 'outline';
  const isAccent = variant === 'accent';
  return (
    <TouchableOpacity
      style={[
        styles.btn,
        isOutline && styles.outline,
        !isOutline && !isAccent && styles.filled,
        !isOutline && isAccent && styles.accentFilled,
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
          isOutline && styles.labelOutline,
          isAccent && !isOutline && styles.labelOnAccent,
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
