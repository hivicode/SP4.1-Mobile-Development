import { Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  Home,
  Package,
  ShoppingCart,
  BarChart3,
} from 'lucide-react-native';

import { colors, inter } from '../theme/design';

import HomeScreen from '../screens/HomeScreen';
import ProductScreen from '../screens/ProductScreen';
import AddProductScreen from '../screens/AddProductScreen';
import CashierScreen from '../screens/CashierScreen';
import PaymentScreen from '../screens/PaymentScreen';
import QRISScreen from '../screens/QRISScreen';
import AddQRISScreen from '../screens/AddQRISScreen';
import ReceiptScreen from '../screens/ReceiptScreen';
import ReportScreen from '../screens/ReportScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const stackHeaderOpts = {
  headerStyle: { backgroundColor: colors.headerGreen },
  headerTintColor: '#FFFFFF',
  headerTitleStyle: { ...inter.extraBold, fontSize: 18, color: '#FFFFFF' },
  headerShadowVisible: false,
};

function IconInPill({ focused, children }) {
  const compact = Platform.OS === 'web';
  return (
    <View
      style={[
        styles.iconPill,
        compact && styles.iconPillWeb,
        focused ? styles.iconPillFocused : styles.iconPillInactive,
      ]}
    >
      {children}
    </View>
  );
}

function MainTabs() {
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === 'web';
  const bottomInset = Math.max(
    insets.bottom,
    Platform.OS === 'android' ? 16 : isWeb ? 8 : 12
  );
  const tabBarBottomGap = bottomInset + (isWeb ? 6 : 10);
  const iconSize = isWeb ? 18 : 22;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarHideOnKeyboard: !isWeb,
        tabBarIconStyle: {
          marginTop: isWeb ? 2 : 4,
          marginBottom: isWeb ? 0 : 4,
        },
        tabBarItemStyle: isWeb
          ? {
              paddingHorizontal: 2,
              flex: 1,
              minWidth: 0,
              overflow: 'visible',
            }
          : undefined,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.borderLight,
          borderTopWidth: StyleSheet.hairlineWidth,
          paddingTop: isWeb ? 6 : 6,
          paddingBottom: tabBarBottomGap,
          paddingHorizontal: isWeb ? 4 : 8,
          minHeight: (isWeb ? 60 : 56) + tabBarBottomGap,
          height: undefined,
          ...(isWeb && { alignSelf: 'stretch', width: '100%', maxWidth: '100%' }),
        },
        tabBarLabelPosition: 'below-icon',
        tabBarLabelStyle: isWeb
          ? {
              fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
              fontSize: 11,
              fontWeight: '600',
              marginTop: 4,
              marginBottom: 6,
              lineHeight: 14,
            }
          : {
              ...inter.bold,
              fontSize: 11,
              marginTop: 2,
              marginBottom:
                Platform.OS === 'android' ? 6 : 4,
            },
      }}
    >
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused, color }) => (
            <IconInPill focused={focused}>
              <Home
                size={iconSize}
                color={focused ? '#FFFFFF' : color}
                strokeWidth={2.4}
              />
            </IconInPill>
          ),
        }}
      />
      <Tab.Screen
        name="ProductScreen"
        component={ProductScreen}
        options={{
          tabBarLabel: 'Produk',
          tabBarIcon: ({ focused, color }) => (
            <IconInPill focused={focused}>
              <Package
                size={iconSize}
                color={focused ? '#FFFFFF' : color}
                strokeWidth={2.4}
              />
            </IconInPill>
          ),
        }}
      />
      <Tab.Screen
        name="CashierScreen"
        component={CashierScreen}
        options={{
          tabBarLabel: 'Kasir',
          tabBarIcon: ({ focused, color }) => (
            <IconInPill focused={focused}>
              <ShoppingCart
                size={iconSize}
                color={focused ? '#FFFFFF' : color}
                strokeWidth={2.4}
              />
            </IconInPill>
          ),
        }}
      />
      <Tab.Screen
        name="ReportScreen"
        component={ReportScreen}
        options={{
          tabBarLabel: 'Laporan',
          tabBarIcon: ({ focused, color }) => (
            <IconInPill focused={focused}>
              <BarChart3
                size={iconSize}
                color={focused ? '#FFFFFF' : color}
                strokeWidth={2.4}
              />
            </IconInPill>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer
      theme={{
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          primary: colors.primary,
          background: colors.pageBg,
          card: colors.white,
          text: colors.ink,
          border: colors.borderLight,
          notification: colors.accent,
        },
      }}
    >
      <Stack.Navigator
        initialRouteName="MainTabs"
        screenOptions={stackHeaderOpts}
      >
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddProductScreen"
          component={AddProductScreen}
          options={{ title: 'Tambah / Ubah Produk' }}
        />
        <Stack.Screen
          name="AddQRISScreen"
          component={AddQRISScreen}
          options={{ title: 'Tambah / Ubah QRIS' }}
        />
        <Stack.Screen
          name="PaymentScreen"
          component={PaymentScreen}
          options={{ title: 'Pembayaran' }}
        />
        <Stack.Screen
          name="QRISScreen"
          component={QRISScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ReceiptScreen"
          component={ReceiptScreen}
          options={{ title: 'Struk', headerBackVisible: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  iconPill: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 7,
    borderRadius: 999,
  },
  iconPillInactive: {
    backgroundColor: 'transparent',
  },
  iconPillFocused: {
    backgroundColor: colors.primary,
  },
  iconPillWeb: {
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 999,
  },
});
