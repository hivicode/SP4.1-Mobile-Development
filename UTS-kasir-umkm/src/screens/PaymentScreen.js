import { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import ButtonPrimary from '../components/ButtonPrimary';
import DummyQrCode from '../components/DummyQrCode';
import QrisProviderLogo from '../components/QrisProviderLogo';
import ScreenShell from '../components/ScreenShell';
import {
  addTransaction,
  clearCart,
  getQrisAccounts,
} from '../storage/storage';
import { colors, cardShadow, inter } from '../theme/design';

function makeTxId() {
  return `TX-${Date.now()}`;
}

const QRIS_PAY_LIMIT_SEC = 5 * 60;

function formatCountdown(sec) {
  const s = Math.max(0, sec);
  const m = Math.floor(s / 60);
  const rest = s % 60;
  return `${String(m).padStart(2, '0')}:${String(rest).padStart(2, '0')}`;
}

function formatTxnCreated(dt) {
  return dt.toLocaleString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function PaymentScreen({ navigation, route }) {
  const { cartItems, cartTotal } = route.params || {};
  const [step, setStep] = useState('method');
  const [qrisList, setQrisList] = useState([]);
  const [selectedQris, setSelectedQris] = useState(null);
  const [sessionCreatedLabel] = useState(() =>
    formatTxnCreated(new Date())
  );
  const [qrisDeadlineMs, setQrisDeadlineMs] = useState(null);
  const [qrisSecondsLeft, setQrisSecondsLeft] = useState(null);

  useEffect(() => {
    (async () => {
      setQrisList(await getQrisAccounts());
    })();
  }, []);

  useEffect(() => {
    if (step !== 'qrisPay' || qrisDeadlineMs == null) {
      setQrisSecondsLeft(null);
      return undefined;
    }
    const tick = () => {
      setQrisSecondsLeft(
        Math.max(0, Math.ceil((qrisDeadlineMs - Date.now()) / 1000))
      );
    };
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, [step, qrisDeadlineMs]);

  const formatMoney = (n) => `Rp ${Number(n).toLocaleString('id-ID')}`;

  const finishPayment = async (methodLabel) => {
    const safeItems = Array.isArray(cartItems) ? cartItems : [];
    const tx = {
      id: makeTxId(),
      items: safeItems.map((c) => ({ ...c })),
      total: cartTotal,
      method: methodLabel,
      date: new Date().toISOString(),
    };
    await addTransaction(tx);
    await clearCart();
    navigation.replace('ReceiptScreen', { transaction: tx });
  };

  const onCash = () => {
    finishPayment('Cash');
  };

  const onPickQris = (account) => {
    setSelectedQris(account);
    setQrisDeadlineMs(Date.now() + QRIS_PAY_LIMIT_SEC * 1000);
    setQrisSecondsLeft(QRIS_PAY_LIMIT_SEC);
    setStep('qrisPay');
  };

  const onCompleteQris = () => {
    if (!selectedQris) return;
    finishPayment(`QRIS · ${selectedQris.providerName}`);
  };

  const renderBody = () => {
    if (!cartItems || cartTotal === undefined) {
      return (
        <View style={styles.center}>
          <Text style={styles.warn}>Tidak ada data pembayaran.</Text>
          <ButtonPrimary title="Kembali" onPress={() => navigation.goBack()} />
        </View>
      );
    }

    if (step === 'method') {
      return (
        <View style={styles.pad}>
          <Text style={styles.title}>Metode pembayaran</Text>
          <Text style={styles.totalHint}>Total {formatMoney(cartTotal)}</Text>

          <TouchableOpacity style={styles.methodCard} onPress={onCash} activeOpacity={0.92}>
            <Text style={styles.methodTitle}>Cash</Text>
            <Text style={styles.methodDesc}>Bayar tunai</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.methodCard}
            onPress={() => {
              if (qrisList.length === 0) {
                setStep('emptyQris');
              } else {
                setStep('qrisPick');
              }
            }}
            activeOpacity={0.92}
          >
            <Text style={styles.methodTitle}>QRIS</Text>
            <Text style={styles.methodDesc}>Pilih akun QRIS</Text>
          </TouchableOpacity>

          <ButtonPrimary
            title="Batal"
            variant="outline"
            onPress={() => navigation.goBack()}
            style={styles.cancel}
          />
        </View>
      );
    }

    if (step === 'emptyQris') {
      return (
        <View style={styles.pad}>
          <Text style={styles.title}>Belum ada QRIS</Text>
          <Text style={styles.sub}>
            Tambah akun di menu Kelola QRIS terlebih dahulu.
          </Text>
          <ButtonPrimary
            title="Ke Kelola QRIS"
            onPress={() => {
              navigation.navigate('QRISScreen');
            }}
          />
          <ButtonPrimary
            title="Kembali"
            variant="outline"
            onPress={() => setStep('method')}
            style={styles.cancel}
          />
        </View>
      );
    }

    if (step === 'qrisPick') {
      return (
        <View style={[styles.pad, styles.flexGrow]}>
          <Text style={styles.title}>Pilih penyedia QRIS</Text>
          <Text style={styles.totalHint}>Total {formatMoney(cartTotal)}</Text>
          <FlatList
            data={qrisList}
            keyExtractor={(item, index) => String(item?.id ?? index)}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.qrisPick}
                onPress={() => onPickQris(item)}
                activeOpacity={0.92}
              >
                <View style={styles.qrisPickRow}>
                  <View style={styles.qrisPickLogo}>
                    <QrisProviderLogo
                      providerName={item.providerName}
                      size={48}
                      borderRadius={12}
                    />
                  </View>
                  <View style={styles.qrisPickText}>
                    <Text style={styles.qrisPickTitle}>{item.providerName}</Text>
                    <Text style={styles.qrisPickSub}>{item.merchantName}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
          <ButtonPrimary
            title="Kembali"
            variant="outline"
            onPress={() => setStep('method')}
          />
        </View>
      );
    }

    const qrUrl = selectedQris?.qrImageUrl?.trim() || '';

    const timerExpired =
      qrisSecondsLeft != null && qrisSecondsLeft <= 0;

    return (
      <View style={styles.pad}>
        <Text style={styles.title}>Pembayaran QRIS</Text>
        <Text style={styles.providerLabel}>{selectedQris?.providerName}</Text>
        <Text style={styles.merchant}>{selectedQris?.merchantName}</Text>

        <View style={styles.qrisMetaCard}>
          <Text style={styles.txnCreatedCaption}>Informasi sesi pembayaran</Text>
          <Text style={styles.txnCreatedValue}>{sessionCreatedLabel}</Text>
          <View style={styles.timerBlock}>
            <Text style={styles.timerCaption}>Waktu pembayaran QRIS</Text>
            <Text
              style={[
                styles.timerDigits,
                timerExpired && styles.timerDigitsExpired,
              ]}
              accessibilityLiveRegion="polite"
            >
              {qrisSecondsLeft != null
                ? formatCountdown(qrisSecondsLeft)
                : '05:00'}
            </Text>
            <Text style={styles.timerSub}>
              Berlaku selama {QRIS_PAY_LIMIT_SEC / 60} menit sejak Anda memilih
              penyedia. Setelah itu sebaiknya pilih lagi atau sesuaikan nominal.
            </Text>
          </View>
          {timerExpired ? (
            <Text style={styles.timerExpiredMsg}>
              Batas waktu QRIS telah lewat untuk sesi ini. Tekan tombol Ganti
              penyedia untuk membuat kode pembayaran ulang atau hubungi pembeli.
            </Text>
          ) : null}
        </View>

        <View style={styles.qrBox}>
          {qrUrl ? (
            <Image
              source={{ uri: qrUrl }}
              style={styles.qrImage}
              resizeMode="contain"
            />
          ) : (
            <DummyQrCode
              size={220}
              seed={selectedQris?.id || `${selectedQris?.merchantName || ''}_${selectedQris?.providerName || ''}`}
            />
          )}
        </View>

        <Text style={styles.payTotal}>Total {formatMoney(cartTotal)}</Text>

        <ButtonPrimary title="Selesaikan pembayaran" onPress={onCompleteQris} />

        <ButtonPrimary
          title="Ganti penyedia"
          variant="outline"
          onPress={() => {
            setQrisDeadlineMs(null);
            setQrisSecondsLeft(null);
            setStep('qrisPick');
          }}
          style={styles.cancel}
        />
      </View>
    );
  };

  return (
    <ScreenShell>
      <View style={styles.shellInner}>{renderBody()}</View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  shellInner: {
    flex: 1,
  },
  flexGrow: { flex: 1 },
  pad: {
    flex: 1,
    padding: 20,
    backgroundColor: 'transparent',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: 'transparent',
  },
  warn: {
    textAlign: 'center',
    marginBottom: 16,
    color: colors.inkMuted,
  },
  title: {
    ...inter.extraBold,
    fontSize: 22,
    color: colors.ink,
    marginBottom: 8,
  },
  sub: {
    fontSize: 15,
    color: colors.inkMuted,
    marginBottom: 20,
    lineHeight: 22,
  },
  totalHint: {
    ...inter.extraBold,
    fontSize: 19,
    color: colors.primary,
    marginBottom: 20,
  },
  methodCard: {
    backgroundColor: colors.card,
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...cardShadow(0.07, 8),
  },
  methodTitle: {
    ...inter.extraBold,
    fontSize: 18,
    color: colors.primary,
  },
  methodDesc: {
    fontSize: 14,
    color: colors.inkMuted,
    marginTop: 4,
  },
  cancel: {
    marginTop: 12,
  },
  list: {
    paddingBottom: 16,
    flexGrow: 1,
  },
  qrisPick: {
    backgroundColor: colors.card,
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...cardShadow(0.06, 5),
  },
  qrisPickRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qrisPickLogo: {
    width: 48,
    height: 48,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 14,
    backgroundColor: colors.primarySoft,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  qrisPickText: {
    flex: 1,
    minWidth: 0,
  },
  qrisPickTitle: {
    ...inter.extraBold,
    fontSize: 16,
    color: colors.ink,
  },
  qrisPickSub: {
    fontSize: 14,
    color: colors.inkMuted,
    marginTop: 4,
  },
  providerLabel: {
    ...inter.extraBold,
    fontSize: 16,
    color: colors.primary,
    marginTop: 8,
  },
  merchant: {
    fontSize: 14,
    color: colors.inkMuted,
    marginBottom: 12,
  },
  qrisMetaCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...cardShadow(0.06, 8),
  },
  txnCreatedCaption: {
    ...inter.semiBold,
    fontSize: 11,
    color: colors.inkSoft,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 4,
  },
  txnCreatedValue: {
    ...inter.bold,
    fontSize: 14,
    color: colors.ink,
    marginBottom: 14,
    lineHeight: 20,
  },
  timerBlock: {
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: 12,
  },
  timerCaption: {
    ...inter.semiBold,
    fontSize: 13,
    color: colors.inkMuted,
    marginBottom: 6,
  },
  timerDigits: {
    ...inter.extraBold,
    fontSize: 32,
    color: colors.primary,
    letterSpacing: 2,
    fontVariant: ['tabular-nums'],
    marginBottom: 8,
  },
  timerDigitsExpired: {
    color: colors.danger,
  },
  timerSub: {
    ...inter.semiBold,
    fontSize: 11,
    color: colors.inkSoft,
    lineHeight: 16,
  },
  timerExpiredMsg: {
    ...inter.semiBold,
    fontSize: 12,
    color: colors.danger,
    marginTop: 10,
    lineHeight: 17,
  },
  qrBox: {
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...cardShadow(0.09, 10),
  },
  qrImage: {
    width: 220,
    height: 220,
    backgroundColor: colors.surface,
    borderRadius: 12,
  },
  qrHint: {
    ...inter.semiBold,
    fontSize: 13,
    color: colors.inkMuted,
    textAlign: 'center',
    marginTop: 14,
    lineHeight: 19,
    paddingHorizontal: 6,
  },
  payTotal: {
    ...inter.extraBold,
    fontSize: 20,
    color: colors.ink,
    textAlign: 'center',
    marginBottom: 16,
  },
});
