import { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Image,
  Alert,
  StatusBar,
  Keyboard,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Scan } from 'lucide-react-native';
import ButtonPrimary from '../components/ButtonPrimary';
import ScreenShell from '../components/ScreenShell';
import ProductThumb from '../components/ProductThumb';
import { GreenHeaderTitle } from '../components/GreenHeader';
import { getProducts, saveProducts } from '../storage/storage';
import { colors, inter, cardShadow } from '../theme/design';
import { useAppSettings } from '../context/AppSettingsContext';

const pickerOptions = {
  mediaTypes: ['images'],
  allowsEditing: true,
  aspect: [1, 1],
  quality: 0.55,
  base64: true,
};

function assetToPersistUri(asset) {
  if (!asset) return null;
  if (asset.base64) {
    return `data:image/jpeg;base64,${asset.base64}`;
  }
  return asset.uri || null;
}

export default function AddProductScreen({ navigation, route }) {
  const { appColors } = useAppSettings();
  const insets = useSafeAreaInsets();
  const androidBar = StatusBar.currentHeight ?? 0;
  const topInset = Platform.OS === 'android' ? Math.max(insets.top, androidBar) : insets.top;
  const headerHeight = topInset + 64;

  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === 'android' ? 'keyboardDidShow' : 'keyboardWillShow',
      (e) => setKeyboardHeight(e.endCoordinates.height)
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide',
      () => setKeyboardHeight(0)
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const editing = route.params?.product;
  const [name, setName] = useState(editing?.name ?? '');
  const [price, setPrice] = useState(
    editing ? String(editing.price) : ''
  );
  const [imageUri, setImageUri] = useState(editing?.imageUri ?? null);
  const [barcode, setBarcode] = useState(editing?.barcode ?? '');
  const [scanning, setScanning] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  const startScanning = async () => {
    if (!permission || !permission.granted) {
      const res = await requestPermission();
      if (!res.granted) {
        Alert.alert(
          'Izin kamera',
          'Aplikasi memerlukan izin kamera untuk memindai barcode.'
        );
        return;
      }
    }
    setScanning(true);
  };

  const pickFromLibrary = async () => {
    const lib = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!lib.granted) {
      Alert.alert(
        'Izin galeri',
        'Izinkan akses galeri untuk memilih foto produk.'
      );
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync(pickerOptions);
    if (res.canceled || !res.assets?.[0]) return;
    const uri = assetToPersistUri(res.assets[0]);
    setImageUri(uri);
  };

  const takePhoto = async () => {
    const cam = await ImagePicker.requestCameraPermissionsAsync();
    if (!cam.granted) {
      Alert.alert(
        'Izin kamera',
        'Izinkan akses kamera untuk memfoto produk.'
      );
      return;
    }
    const res = await ImagePicker.launchCameraAsync(pickerOptions);
    if (res.canceled || !res.assets?.[0]) return;
    const uri = assetToPersistUri(res.assets[0]);
    setImageUri(uri);
  };

  const clearImage = () => setImageUri(null);

  const save = async () => {
    const trimmed = name.trim();
    const num = parseFloat(price.replace(/,/g, '.'));
    if (!trimmed || Number.isNaN(num) || num < 0) {
      return;
    }
    const list = await getProducts();
    if (editing) {
      const next = list.map((p) => {
        if (p.id !== editing.id) return p;
        const updated = {
          ...p,
          name: trimmed,
          price: num,
        };
        const bc = barcode.trim();
        if (bc) {
          updated.barcode = bc;
        } else {
          delete updated.barcode;
        }
        if (imageUri) {
          updated.imageUri = imageUri;
        } else {
          delete updated.imageUri;
        }
        return updated;
      });
      await saveProducts(next);
    } else {
      const id = 'p_' + Date.now();
      const product = { id, name: trimmed, price: num };
      const bc = barcode.trim();
      if (bc) product.barcode = bc;
      if (imageUri) product.imageUri = imageUri;
      await saveProducts([...list, product]);
    }
    navigation.goBack();
  };

  const idForPreview = editing?.id ?? 'preview';

  if (scanning) {
    return (
      <View style={StyleSheet.absoluteFillObject}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          onBarcodeScanned={({ data }) => {
            setBarcode(data);
            setScanning(false);
          }}
        />
        <View style={styles.scanOverlay}>
          <Text style={styles.scanText}>Arahkan kamera ke Barcode</Text>
          <ButtonPrimary
            title="Batal"
            onPress={() => setScanning(false)}
            style={styles.scanCancel}
          />
        </View>
      </View>
    );
  }

  return (
    <ScreenShell>
      <GreenHeaderTitle
        title={editing ? "Ubah Produk" : "Tambah Produk"}
        onBack={() => navigation.goBack()}
      />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={headerHeight}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.content,
            Platform.OS === 'android' && keyboardHeight > 0
              ? { paddingBottom: keyboardHeight + 20 }
              : null
          ]}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={[styles.label, { color: appColors.ink }]}>Foto produk</Text>
          <View
            style={[
              styles.imageBlock,
              {
                backgroundColor: appColors.mintIconBg,
                borderColor: '#0F172A',
              },
            ]}
          >
            {imageUri ? (
              <Image
                source={{ uri: imageUri }}
                style={styles.previewFull}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.previewPlaceholder}>
                <ProductThumb
                  imageUri={null}
                  productId={idForPreview}
                  size={96}
                />
                <Text style={[styles.previewHint, { color: appColors.inkMuted }]}>
                  Belum ada foto. Tap galeri/kamera untuk pakai foto.
                </Text>
              </View>
            )}
          </View>
          <View style={styles.pickRow}>
            <TouchableOpacity
              style={[
                styles.pickBtn,
                styles.pickBtnPrimary,
                {
                  backgroundColor: appColors.primarySoft,
                  borderColor: '#0F172A',
                },
              ]}
              onPress={pickFromLibrary}
              activeOpacity={0.88}
            >
              <Text style={[styles.pickBtnText, { color: appColors.primary }]}>
                Galeri
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.pickBtn,
                styles.pickBtnPrimary,
                {
                  backgroundColor: appColors.primarySoft,
                  borderColor: '#0F172A',
                },
              ]}
              onPress={takePhoto}
              activeOpacity={0.88}
            >
              <Text style={[styles.pickBtnText, { color: appColors.primary }]}>
                Kamera
              </Text>
            </TouchableOpacity>
            {imageUri ? (
              <TouchableOpacity
                style={styles.pickBtn}
                onPress={clearImage}
                activeOpacity={0.88}
              >
                <Text style={styles.pickBtnMuted}>Hapus foto</Text>
              </TouchableOpacity>
            ) : null}
          </View>

          <Text style={[styles.label, { color: appColors.ink }]}>Barcode / SKU</Text>
          <View style={styles.barcodeInputRow}>
            <TextInput
              style={[
                styles.barcodeInput,
                {
                  backgroundColor: appColors.card,
                  borderColor: '#0F172A',
                  color: appColors.ink,
                },
              ]}
              placeholder="Scan atau ketik kode barcode"
              placeholderTextColor={colors.inkSoft}
              value={barcode}
              onChangeText={setBarcode}
            />
            <TouchableOpacity
              style={[styles.barcodeScanBtn, { backgroundColor: '#A3E635' }]}
              onPress={startScanning}
            >
              <Scan size={20} color="#0F172A" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>

          <Text style={[styles.label, { color: appColors.ink }]}>Nama produk</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: appColors.card,
                borderColor: '#0F172A',
                color: appColors.ink,
              },
            ]}
            placeholder="Contoh: Kopi Susu"
            placeholderTextColor={colors.inkSoft}
            value={name}
            onChangeText={setName}
          />
          <Text style={[styles.label, { color: appColors.ink }]}>Harga (Rp)</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: appColors.card,
                borderColor: '#0F172A',
                color: appColors.ink,
              },
            ]}
            placeholder="15000"
            placeholderTextColor={colors.inkSoft}
            keyboardType="decimal-pad"
            value={price}
            onChangeText={setPrice}
          />
          <ButtonPrimary
            title={editing ? 'Simpan perubahan' : 'Simpan produk'}
            onPress={save}
            disabled={!name.trim() || !price.trim()}
            style={styles.saveBtn}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  label: {
    ...inter.bold,
    fontSize: 14,
    color: colors.ink,
    marginBottom: 8,
  },
  imageBlock: {
    width: '100%',
    aspectRatio: 1,
    maxHeight: 220,
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 12,
    backgroundColor: colors.mintIconBg,
    borderWidth: 2.2,
    borderColor: '#0F172A',
  },
  previewFull: {
    width: '100%',
    height: '100%',
  },
  previewPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewHint: {
    ...inter.semiBold,
    marginTop: 10,
    fontSize: 13,
    color: colors.inkMuted,
    textAlign: 'center',
    alignSelf: 'stretch',
    paddingHorizontal: 20,
  },
  pickRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 22,
  },
  pickBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#0F172A',
    backgroundColor: colors.card,
    marginRight: 8,
    marginBottom: 8,
    ...cardShadow(),
  },
  pickBtnPrimary: {
    backgroundColor: colors.primarySoft,
    borderColor: '#0F172A',
  },
  pickBtnText: {
    ...inter.bold,
    fontSize: 14,
    color: colors.primary,
  },
  pickBtnMuted: {
    ...inter.semiBold,
    fontSize: 14,
    color: colors.danger,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.ink,
    marginBottom: 18,
    borderWidth: 2.2,
    borderColor: '#0F172A',
  },
  barcodeInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  barcodeInput: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.ink,
    borderWidth: 2.2,
    borderColor: '#0F172A',
    marginRight: 10,
  },
  barcodeScanBtn: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.2,
    borderColor: '#0F172A',
    ...cardShadow(),
  },
  scanOverlay: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  scanText: {
    ...inter.bold,
    color: '#FFFFFF',
    fontSize: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
  scanCancel: {
    width: 140,
  },
  saveBtn: {
    marginTop: 8,
  },
});
