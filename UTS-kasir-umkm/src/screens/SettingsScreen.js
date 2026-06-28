import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ImagePlus, Moon, Store, Sun, Trash2, UserRound } from 'lucide-react-native';
import { GreenHeaderTitle } from '../components/GreenHeader';
import { useAppSettings } from '../context/AppSettingsContext';
import { colors, createThemedColors, inter } from '../theme/design';

export default function SettingsScreen() {
  const { ready, settings, updateSettings } = useAppSettings();
  const [storeName, setStoreName] = useState(settings.storeName);
  const [ownerName, setOwnerName] = useState(settings.ownerName);
  const [logoUri, setLogoUri] = useState(settings.logoUri);
  const [appearanceMode, setAppearanceMode] = useState(settings.appearanceMode || 'light');
  const updateSettingsRef = useRef(updateSettings);

  const previewColors = createThemedColors(undefined, appearanceMode);

  useEffect(() => {
    updateSettingsRef.current = updateSettings;
  }, [updateSettings]);

  useEffect(() => {
    setStoreName(settings.storeName);
    setOwnerName(settings.ownerName);
    setLogoUri(settings.logoUri);
    setAppearanceMode(settings.appearanceMode || 'light');
  }, [settings]);

  useEffect(() => {
    if (!ready) return undefined;

    const cleanStoreName = storeName.trim();
    const cleanOwnerName = ownerName.trim();
    if (!cleanStoreName || !cleanOwnerName) return undefined;

    const next = {
      storeName: cleanStoreName,
      ownerName: cleanOwnerName,
      logoUri,
      appearanceMode,
    };

    const same =
      settings.storeName === next.storeName &&
      settings.ownerName === next.ownerName &&
      settings.logoUri === next.logoUri &&
      (settings.appearanceMode || 'light') === next.appearanceMode;

    if (same) return undefined;

    const id = setTimeout(() => {
      updateSettingsRef.current(next);
    }, 350);

    return () => clearTimeout(id);
  }, [
    appearanceMode,
    logoUri,
    ownerName,
    ready,
    settings.appearanceMode,
    settings.logoUri,
    settings.ownerName,
    settings.storeName,
    storeName,
  ]);

  const handleStoreNameChange = (value) => {
    setStoreName(value);
  };

  const handleOwnerNameChange = (value) => {
    setOwnerName(value);
  };

  const requireFilledNames = () => {
    if (storeName.trim() && ownerName.trim()) {
      return;
    }
    Alert.alert('Data belum lengkap', 'Nama UMKM dan nama pengguna wajib diisi.');
  };

  const pickLogo = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Izin diperlukan', 'Aktifkan izin galeri untuk memilih logo UMKM.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      const nextLogoUri = result.assets[0].uri;
      setLogoUri(nextLogoUri);
    }
  };

  const clearLogo = () => {
    setLogoUri(null);
  };

  return (
    <View style={[styles.screen, { backgroundColor: previewColors.pageBg }]}>
      <GreenHeaderTitle title="Profil" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
          overScrollMode="never"
        >
          <View
            style={[
              styles.panel,
              {
                backgroundColor: previewColors.card,
                borderColor: previewColors.borderLight,
              },
            ]}
          >
            <View style={styles.sectionHeader}>
              <View style={[styles.iconBox, { backgroundColor: previewColors.primarySoft }]}>
                <Store size={22} color={previewColors.primary} strokeWidth={2.4} />
              </View>
              <Text style={[styles.sectionTitle, { color: previewColors.ink }]}>
                Identitas Toko
              </Text>
            </View>

            <Text style={[styles.label, { color: previewColors.inkMuted }]}>Logo</Text>
            <View style={styles.logoRow}>
              <View
                style={[
                  styles.logoPreview,
                  {
                    backgroundColor: previewColors.primarySoft,
                    borderColor: previewColors.borderLight,
                  },
                ]}
              >
                {logoUri ? (
                  <Image source={{ uri: logoUri }} style={styles.logoImage} resizeMode="cover" />
                ) : (
                  <Store size={34} color={previewColors.primary} strokeWidth={2.3} />
                )}
              </View>
              <View style={styles.logoActions}>
                <TouchableOpacity
                  activeOpacity={0.86}
                  onPress={pickLogo}
                  style={[styles.logoBtn, { borderColor: previewColors.primarySoft }]}
                >
                  <ImagePlus size={18} color={previewColors.primary} strokeWidth={2.4} />
                  <Text style={[styles.logoBtnText, { color: previewColors.primary }]}>
                    Pilih Logo
                  </Text>
                </TouchableOpacity>
                {logoUri ? (
                  <TouchableOpacity
                    activeOpacity={0.86}
                    onPress={clearLogo}
                    style={[styles.logoBtn, styles.logoBtnDanger]}
                  >
                    <Trash2 size={18} color={colors.danger} strokeWidth={2.4} />
                    <Text style={[styles.logoBtnText, { color: colors.danger }]}>Hapus</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
            <Text style={[styles.label, { color: previewColors.inkMuted }]}>Nama UMKM</Text>
            <TextInput
              value={storeName}
              onChangeText={handleStoreNameChange}
              onBlur={requireFilledNames}
              placeholder="Contoh: Warung Bintang"
              placeholderTextColor={previewColors.inkSoft}
              style={[
                styles.input,
                {
                  backgroundColor: previewColors.pageBg,
                  borderColor: previewColors.primarySoft,
                  color: previewColors.ink,
                },
              ]}
            />

            <Text style={[styles.label, { color: previewColors.inkMuted }]}>
              Nama Pemilik
            </Text>
            <TextInput
              value={ownerName}
              onChangeText={handleOwnerNameChange}
              onBlur={requireFilledNames}
              placeholder="Contoh: Bintang"
              placeholderTextColor={previewColors.inkSoft}
              style={[
                styles.input,
                {
                  backgroundColor: previewColors.pageBg,
                  borderColor: previewColors.primarySoft,
                  color: previewColors.ink,
                },
              ]}
            />
          </View>

          <View style={styles.footer}>
            <View style={[styles.footerIcon, { backgroundColor: previewColors.primary }]}>
              <UserRound size={18} color={previewColors.onPrimary} strokeWidth={2.5} />
            </View>
            <Text style={[styles.footerText, { color: previewColors.inkMuted }]}>
              Dibuat oleh{' '}
              <Text
                style={[styles.footerLink, { color: previewColors.primary }]}
                onPress={() => Linking.openURL('https://github.com/hivicode')}
              >
                Bintang
              </Text>{' '}
              - STIKOM PGRI Banyuwangi
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  screen: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 34,
  },
  panel: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sectionTitle: {
    ...inter.extraBold,
    fontSize: 17,
  },
  label: {
    ...inter.bold,
    fontSize: 13,
    marginBottom: 8,
  },
  input: {
    ...inter.semiBold,
    borderWidth: 1.5,
    borderRadius: 14,
    fontSize: 15,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 13 : 10,
    marginBottom: 14,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  logoPreview: {
    width: 86,
    height: 86,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginRight: 14,
    borderWidth: 1,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  logoActions: {
    flex: 1,
  },
  logoBtn: {
    minHeight: 40,
    borderRadius: 13,
    borderWidth: 1.5,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  logoBtnDanger: {
    borderColor: colors.dangerSoft,
  },
  logoBtnText: {
    ...inter.extraBold,
    fontSize: 13,
    marginLeft: 8,
  },
  modeRow: {
    flexDirection: 'row',
    gap: 10,
  },
  modeBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: colors.borderLight,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modeText: {
    ...inter.extraBold,
    fontSize: 13,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 24,
    paddingHorizontal: 12,
  },
  footerIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  footerText: {
    ...inter.bold,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
  },
  footerLink: {
    textDecorationLine: 'underline',
  },
});
