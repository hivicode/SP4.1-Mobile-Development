import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Home,
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
} from 'lucide-react-native';

import { inter, cardShadow } from '../theme/design';
import { useAppSettings } from '../context/AppSettingsContext';

import HomeScreen from '../screens/HomeScreen';
import ProductScreen from '../screens/ProductScreen';
import AddProductScreen from '../screens/AddProductScreen';
import CashierScreen from '../screens/CashierScreen';
import PaymentScreen from '../screens/PaymentScreen';
import QRISScreen from '../screens/QRISScreen';
import AddQRISScreen from '../screens/AddQRISScreen';
import ReceiptScreen from '../screens/ReceiptScreen';
import ReportScreen from '../screens/ReportScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TAB_ICONS = {
  HomeScreen: Home,
  ProductScreen: Package,
  CashierScreen: ShoppingCart,
  ReportScreen: BarChart3,
  SettingsScreen: Settings,
};

function getTabIndicatorColors(index) {
  switch (index) {
    case 0: // Home (Green)
      return ['#BEF264', '#84CC16'];
    case 1: // Produk (Purple)
      return ['#C084FC', '#A855F7'];
    case 2: // Kasir (Blue)
      return ['#60A5FA', '#2563EB'];
    case 3: // Laporan (Pink)
      return ['#F472B6', '#EC4899'];
    case 4: // Profil (Yellow/Orange)
      return ['#FBBF24', '#F59E0B'];
    default:
      return ['#BEF264', '#84CC16'];
  }
}

function SlidingTabBar({ state, descriptors, navigation }) {
  const { appColors } = useAppSettings();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === 'web';
  const [barWidth, setBarWidth] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;
  const bottomInset = Math.max(
    insets.bottom,
    Platform.OS === 'android' ? 16 : isWeb ? 8 : 12
  );
  const itemWidth = barWidth > 0 ? barWidth / state.routes.length : 0;
  const indicatorWidth = Math.min(isWeb ? 46 : 58, Math.max(42, itemWidth - 20));
  const indicatorHeight = isWeb ? 34 : 38;
  const indicatorTop = isWeb ? 5 : 7;
  const iconSize = isWeb ? 18 : 21;

  useEffect(() => {
    if (!itemWidth) return;
    Animated.spring(translateX, {
      toValue: state.index * itemWidth + (itemWidth - indicatorWidth) / 2,
      damping: 19,
      stiffness: 190,
      mass: 0.8,
      useNativeDriver: true,
    }).start();
  }, [indicatorWidth, itemWidth, state.index, translateX]);

  return (
    <View
      style={[
        styles.tabShell,
        {
          backgroundColor: appColors.card,
          borderTopColor: appColors.borderLight,
          paddingBottom: bottomInset,
        },
      ]}
    >
      <View
        style={styles.tabRow}
        onLayout={(event) => setBarWidth(event.nativeEvent.layout.width)}
      >
        {barWidth > 0 ? (
          <Animated.View
            pointerEvents="none"
            style={[
              styles.slidingIndicator,
              {
                width: indicatorWidth,
                height: indicatorHeight,
                top: indicatorTop,
                transform: [{ translateX }],
                overflow: 'hidden',
                borderWidth: 1.5,
                borderColor: '#0F172A',
                ...cardShadow(),
              },
            ]}
          >
            <LinearGradient
              colors={['#BEF264', '#84CC16']}
              style={StyleSheet.absoluteFillObject}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            />
          </Animated.View>
        ) : null}
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const focused = state.index === index;
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
                ? options.title
                : route.name;
          const Icon = TAB_ICONS[route.name] || Home;
          const iconColor = focused ? '#0F172A' : appColors.tabInactive;
          const labelColor = focused ? '#0F172A' : appColors.tabInactive;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={focused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarButtonTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabItem}
            >
              <View style={[styles.tabIconSlot, { height: indicatorHeight + 8 }]}>
                <Icon size={iconSize} color={iconColor} strokeWidth={2.4} />
              </View>
              <Text
                numberOfLines={1}
                style={[
                  styles.tabLabel,
                  isWeb && styles.tabLabelWeb,
                  { color: labelColor },
                ]}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <SlidingTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="ProductScreen"
        component={ProductScreen}
        options={{
          tabBarLabel: 'Produk',
        }}
      />
      <Tab.Screen
        name="CashierScreen"
        component={CashierScreen}
        options={{
          tabBarLabel: 'Kasir',
        }}
      />
      <Tab.Screen
        name="ReportScreen"
        component={ReportScreen}
        options={{
          tabBarLabel: 'Laporan',
        }}
      />
      <Tab.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Profil',
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { appColors } = useAppSettings();

  return (
    <NavigationContainer
      theme={{
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          primary: appColors.primary,
          background: appColors.pageBg,
          card: appColors.card,
          text: appColors.ink,
          border: appColors.borderLight,
          notification: appColors.accent,
        },
      }}
    >
      <Stack.Navigator
        initialRouteName="MainTabs"
        screenOptions={{
          headerStyle: { backgroundColor: appColors.headerGreen },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { ...inter.extraBold, fontSize: 18, color: '#FFFFFF' },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddProductScreen"
          component={AddProductScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddQRISScreen"
          component={AddQRISScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PaymentScreen"
          component={PaymentScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="QRISScreen"
          component={QRISScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ReceiptScreen"
          component={ReceiptScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabShell: {
    position: 'relative',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 10,
    paddingHorizontal: 8,
    minHeight: 78,
    overflow: 'hidden',
  },
  slidingIndicator: {
    position: 'absolute',
    left: 0,
    borderRadius: 999,
  },
  tabRow: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  tabItem: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 2,
    paddingTop: 1,
  },
  tabIconSlot: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  tabLabel: {
    ...inter.bold,
    fontSize: 11,
    lineHeight: 14,
  },
  tabLabelWeb: {
    fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    fontWeight: '600',
  },
});
