import { StyleSheet, Text, View, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import { Printer, Share2 } from 'lucide-react-native';
import ButtonPrimary from '../components/ButtonPrimary';
import ScreenShell from '../components/ScreenShell';
import { colors, cardShadow, inter } from '../theme/design';
import { useAppSettings } from '../context/AppSettingsContext';

export default function ReceiptScreen({ navigation, route }) {
  const { settings, appColors } = useAppSettings();
  const { transaction, fromHistory = false } = route.params || {};

  const formatMoney = (n) => `Rp ${Number(n).toLocaleString('id-ID')}`;
  
  const formatDate = (iso) => {
    try {
      const d = new Date(iso);
      return d.toLocaleString('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    } catch {
      return iso;
    }
  };

  const done = () => {
    if (fromHistory) {
      navigation.goBack();
      return;
    }
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      })
    );
  };

  const generateHtml = () => {
    const storeName = settings.storeName || 'KES';
    const items = Array.isArray(transaction.items) ? transaction.items : [];
    
    return `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
          <style>
            body {
              font-family: 'Courier New', Courier, monospace;
              color: #000;
              margin: 0;
              padding: 20px;
              font-size: 14px;
              line-height: 1.4;
            }
            .center {
              text-align: center;
            }
            .bold {
              font-weight: bold;
            }
            .header {
              font-size: 18px;
              margin-bottom: 5px;
            }
            .divider {
              border-top: 1px dashed #000;
              margin: 15px 0;
            }
            .row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 5px;
            }
            .items-table {
              width: 100%;
              margin-bottom: 10px;
            }
            .items-table td {
              padding: 3px 0;
            }
            .footer-msg {
              font-size: 12px;
              margin-top: 20px;
            }
            .barcode {
              margin: 15px auto;
              width: 150px;
              height: 40px;
              border-left: 2px solid #000;
              border-right: 2px solid #000;
              background: repeating-linear-gradient(
                90deg,
                #000,
                #000 2px,
                #fff 2px,
                #fff 6px
              );
            }
          </style>
        </head>
        <body>
          <div class="center bold header">${storeName}</div>
          <div class="center">Struk Belanja Resmi</div>
          <div class="divider"></div>
          <div class="row">
            <span>No: ${transaction.id}</span>
            <span>${formatDate(transaction.date)}</span>
          </div>
          <div class="divider"></div>
          <table class="items-table">
            ${items.map(item => `
              <tr>
                <td colspan="2" class="bold">${item.name}</td>
              </tr>
              <tr>
                <td>${formatMoney(item.price)} x ${item.qty}</td>
                <td style="text-align: right;">${formatMoney(item.price * item.qty)}</td>
              </tr>
            `).join('')}
          </table>
          <div class="divider"></div>
          <div class="row bold" style="font-size: 16px;">
            <span>TOTAL</span>
            <span>${formatMoney(transaction.total)}</span>
          </div>
          <div class="row">
            <span>Metode</span>
            <span>${transaction.method}</span>
          </div>
          ${transaction.method === 'Cash' ? `
            <div class="row">
              <span>Tunai</span>
              <span>${formatMoney(transaction.cashReceived || transaction.total)}</span>
            </div>
            <div class="row">
              <span>Kembalian</span>
              <span>${formatMoney(transaction.change || 0)}</span>
            </div>
          ` : ''}
          <div class="divider"></div>
          <div class="center footer-msg">Terima Kasih Atas Kunjungan Anda</div>
          <div class="barcode"></div>
          <div class="center" style="font-size: 10px; margin-top: 5px;">${transaction.id}</div>
        </body>
      </html>
    `;
  };

  const handlePrint = async () => {
    try {
      const html = generateHtml();
      await Print.printAsync({ html });
    } catch (err) {
      Alert.alert('Gagal cetak', 'Terjadi kesalahan saat mencetak struk.');
    }
  };

  const handleShare = async () => {
    try {
      const html = generateHtml();
      const { uri } = await Print.printToFileAsync({ html });
      await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
    } catch (err) {
      Alert.alert('Gagal bagikan', 'Terjadi kesalahan saat membagikan PDF.');
    }
  };

  const inner = !transaction ? (
    <View style={styles.center}>
      <Text style={styles.warn}>Tidak ada data struk.</Text>
      <ButtonPrimary title="Tutup" onPress={done} />
    </View>
  ) : (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <View style={[styles.receiptCard, { borderColor: '#0F172A', borderWidth: 2.2 }]}>
        <View style={styles.scissorsCut} />
        
        <Text style={styles.brand}>{settings.storeName || 'KES'}</Text>
        <Text style={[styles.success, { color: appColors.primary }]}>
          {fromHistory ? 'Detail transaksi' : 'Transaksi berhasil'}
        </Text>
        <Text style={styles.id}>{transaction.id}</Text>
        <Text style={styles.date}>{formatDate(transaction.date)}</Text>

        <View style={styles.divider} />

        {(Array.isArray(transaction.items) ? transaction.items : []).map((line, idx) => (
          <View key={`${idx}-${line.productId}`} style={styles.line}>
            <Text style={styles.lineName}>{line.name}</Text>
            <View style={styles.linePriceRow}>
              <Text style={styles.lineMeta}>
                {formatMoney(line.price)} × {line.qty}
              </Text>
              <Text style={styles.lineSubtotal}>
                {formatMoney(line.price * line.qty)}
              </Text>
            </View>
          </View>
        ))}

        <View style={styles.divider} />

        <View style={styles.rowBetween}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={[styles.totalValue, { color: appColors.primary }]}>
            {formatMoney(transaction.total)}
          </Text>
        </View>
        <View style={styles.rowBetween}>
          <Text style={styles.meta}>Metode</Text>
          <Text style={styles.metaBold}>{transaction.method}</Text>
        </View>

        {transaction.method === 'Cash' && (
          <>
            <View style={styles.rowBetween}>
              <Text style={styles.meta}>Tunai</Text>
              <Text style={styles.metaBold}>{formatMoney(transaction.cashReceived || transaction.total)}</Text>
            </View>
            <View style={styles.rowBetween}>
              <Text style={styles.meta}>Kembalian</Text>
              <Text style={[styles.metaBold, { color: '#10B981' }]}>{formatMoney(transaction.change || 0)}</Text>
            </View>
          </>
        )}

        <View style={styles.divider} />

        <Text style={styles.thanksText}>TERIMA KASIH ATAS KUNJUNGAN ANDA</Text>
        <View style={styles.barcodeVisual}>
          <View style={[styles.barcodeBar, { width: 3, marginRight: 2 }]} />
          <View style={[styles.barcodeBar, { width: 1, marginRight: 1 }]} />
          <View style={[styles.barcodeBar, { width: 4, marginRight: 2 }]} />
          <View style={[styles.barcodeBar, { width: 2, marginRight: 1 }]} />
          <View style={[styles.barcodeBar, { width: 1, marginRight: 3 }]} />
          <View style={[styles.barcodeBar, { width: 3, marginRight: 2 }]} />
          <View style={[styles.barcodeBar, { width: 5, marginRight: 1 }]} />
          <View style={[styles.barcodeBar, { width: 2, marginRight: 2 }]} />
          <View style={[styles.barcodeBar, { width: 1, marginRight: 1 }]} />
          <View style={[styles.barcodeBar, { width: 3, marginRight: 3 }]} />
          <View style={[styles.barcodeBar, { width: 4, marginRight: 2 }]} />
          <View style={[styles.barcodeBar, { width: 1, marginRight: 1 }]} />
        </View>
        <Text style={styles.barcodeValueText}>{transaction.id}</Text>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: appColors.primary }]}
          onPress={handlePrint}
          activeOpacity={0.88}
        >
          <Printer size={18} color="#FFFFFF" strokeWidth={2.5} />
          <Text style={styles.actionBtnText}>Cetak Struk</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: '#0F172A' }]}
          onPress={handleShare}
          activeOpacity={0.88}
        >
          <Share2 size={18} color="#FFFFFF" strokeWidth={2.5} />
          <Text style={styles.actionBtnText}>Bagikan PDF</Text>
        </TouchableOpacity>
      </View>

      <ButtonPrimary
        title={fromHistory ? 'Kembali' : 'Selesai'}
        onPress={done}
        style={styles.btn}
      />
    </ScrollView>
  );

  return <ScreenShell>{inner}</ScreenShell>;
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
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
  receiptCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 22,
    borderWidth: 2.2,
    borderColor: '#0F172A',
    ...cardShadow(),
    marginBottom: 20,
    overflow: 'hidden',
  },
  scissorsCut: {
    height: 6,
    borderTopWidth: 2,
    borderTopColor: '#0F172A',
    borderStyle: 'dashed',
    marginHorizontal: -22,
    marginTop: -10,
    marginBottom: 16,
  },
  brand: {
    ...inter.extraBold,
    fontSize: 23,
    color: colors.ink,
    textAlign: 'center',
  },
  success: {
    ...inter.bold,
    fontSize: 15,
    color: colors.primary,
    textAlign: 'center',
    marginTop: 8,
  },
  id: {
    textAlign: 'center',
    color: colors.inkMuted,
    marginTop: 12,
    fontSize: 13,
  },
  date: {
    textAlign: 'center',
    color: colors.inkSoft,
    fontSize: 13,
    marginTop: 4,
  },
  divider: {
    height: 2,
    borderTopWidth: 2,
    borderTopColor: '#0F172A',
    borderStyle: 'dashed',
    marginVertical: 16,
  },
  line: {
    flexDirection: 'column',
    marginBottom: 10,
  },
  lineName: {
    ...inter.bold,
    fontSize: 14,
    color: colors.ink,
  },
  linePriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 3,
  },
  lineMeta: {
    ...inter.semiBold,
    fontSize: 13,
    color: colors.inkMuted,
  },
  lineSubtotal: {
    ...inter.bold,
    fontSize: 13,
    color: colors.ink,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  totalLabel: {
    ...inter.extraBold,
    fontSize: 18,
    color: colors.ink,
  },
  totalValue: {
    ...inter.extraBold,
    fontSize: 23,
    color: colors.primary,
  },
  meta: {
    fontSize: 14,
    color: colors.inkMuted,
  },
  metaBold: {
    ...inter.extraBold,
    fontSize: 14,
    color: colors.ink,
  },
  thanksText: {
    ...inter.bold,
    fontSize: 12,
    textAlign: 'center',
    color: colors.inkMuted,
    marginVertical: 4,
    textTransform: 'uppercase',
  },
  barcodeVisual: {
    flexDirection: 'row',
    justifyContent: 'center',
    height: 40,
    marginTop: 14,
  },
  barcodeBar: {
    height: '100%',
    backgroundColor: '#000000',
  },
  barcodeValueText: {
    ...inter.semiBold,
    fontSize: 10,
    textAlign: 'center',
    color: colors.inkSoft,
    marginTop: 6,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#0F172A',
    marginRight: 8,
    ...cardShadow(),
  },
  actionBtnText: {
    ...inter.bold,
    color: '#FFFFFF',
    fontSize: 14,
    marginLeft: 8,
  },
  btn: {
    marginTop: 4,
  },
});
