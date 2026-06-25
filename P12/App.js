import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  StatusBar as NativeStatusBar,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import {
  BookOpenText,
  Check,
  LogOut,
  Mail,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from 'lucide-react-native';
import { supabase } from './utils/supabase';

const colors = {
  ink: '#172126',
  muted: '#65727a',
  border: '#d8e0e4',
  bg: '#f4f7f8',
  panel: '#ffffff',
  primary: '#0f8b8d',
  primaryDark: '#0a6567',
  danger: '#d64545',
  soft: '#e7f4f3',
};

const androidStatusBarHeight =
  Platform.OS === 'android' ? NativeStatusBar.currentHeight || 0 : 0;

function formatDate(value) {
  if (!value) return '';
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

function IconButton({ icon: Icon, label, onPress, variant = 'ghost', disabled }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.iconButton,
        variant === 'primary' && styles.iconButtonPrimary,
        variant === 'danger' && styles.iconButtonDanger,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <Icon
        size={18}
        color={variant === 'primary' || variant === 'danger' ? '#ffffff' : colors.ink}
      />
    </Pressable>
  );
}

function Button({ children, onPress, disabled, variant = 'primary', icon: Icon }) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        variant === 'secondary' && styles.buttonSecondary,
        variant === 'danger' && styles.buttonDanger,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      {Icon ? (
        <Icon size={18} color={variant === 'secondary' ? colors.ink : '#ffffff'} />
      ) : null}
      <Text
        style={[
          styles.buttonText,
          variant === 'secondary' && styles.buttonTextSecondary,
        ]}
      >
        {children}
      </Text>
    </Pressable>
  );
}

function AuthScreen() {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const isRegister = mode === 'register';

  async function handleAuth() {
    if (!email.trim() || password.length < 6) {
      Alert.alert('Data belum lengkap', 'Email wajib diisi dan password minimal 6 karakter.');
      return;
    }

    setLoading(true);
    const authCall = isRegister
      ? supabase.auth.signUp({ email: email.trim(), password })
      : supabase.auth.signInWithPassword({ email: email.trim(), password });
    const { error } = await authCall;
    setLoading(false);

    if (error) {
      Alert.alert('Gagal', error.message);
      return;
    }

    if (isRegister) {
      Alert.alert('Akun dibuat', 'Jika email confirmation aktif, cek email sebelum login.');
      setMode('login');
    }
  }

  return (
    <SafeAreaView style={styles.authRoot}>
      <ExpoStatusBar style="dark" backgroundColor={colors.bg} translucent={false} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.authKeyboard}
      >
        <ScrollView contentContainerStyle={styles.authContent}>
          <View style={styles.logoMark}>
            <BookOpenText size={34} color="#ffffff" />
          </View>
          <Text style={styles.authTitle}>Catatan Harian</Text>
          <Text style={styles.authSubtitle}>Simpan catatan pribadi dengan Supabase Auth.</Text>

          <View style={styles.segment}>
            <Pressable
              onPress={() => setMode('login')}
              style={[styles.segmentItem, !isRegister && styles.segmentActive]}
            >
              <Text style={[styles.segmentText, !isRegister && styles.segmentTextActive]}>
                Login
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setMode('register')}
              style={[styles.segmentItem, isRegister && styles.segmentActive]}
            >
              <Text style={[styles.segmentText, isRegister && styles.segmentTextActive]}>
                Register
              </Text>
            </Pressable>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWithIcon}>
              <Mail size={18} color={colors.muted} />
              <TextInput
                autoCapitalize="none"
                keyboardType="email-address"
                onChangeText={setEmail}
                placeholder="nama@email.com"
                placeholderTextColor="#9aa7ad"
                style={styles.flexInput}
                value={email}
              />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              onChangeText={setPassword}
              placeholder="Minimal 6 karakter"
              placeholderTextColor="#9aa7ad"
              secureTextEntry
              style={styles.input}
              value={password}
            />
          </View>

          <Button disabled={loading} icon={Check} onPress={handleAuth}>
            {loading ? 'Memproses...' : isRegister ? 'Buat Akun' : 'Masuk'}
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function NoteModal({ visible, initialNote, onClose, onSubmit, saving }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (!visible) return;
    setTitle(initialNote?.title || '');
    setContent(initialNote?.content || '');
  }, [initialNote, visible]);

  function handleSubmit() {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Catatan belum lengkap', 'Judul dan isi catatan wajib diisi.');
      return;
    }
    onSubmit({ title: title.trim(), content: content.trim() });
  }

  return (
    <Modal animationType="slide" visible={visible} onRequestClose={onClose}>
    <SafeAreaView style={styles.modalRoot}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{initialNote ? 'Ubah Catatan' : 'Tambah Catatan'}</Text>
          <IconButton icon={X} label="Tutup" onPress={onClose} />
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalBody}
        >
          <View style={styles.field}>
            <Text style={styles.label}>Judul</Text>
            <TextInput
              onChangeText={setTitle}
              placeholder="Contoh: Ide tugas mobile"
              placeholderTextColor="#9aa7ad"
              style={styles.input}
              value={title}
            />
          </View>

          <View style={styles.fieldGrow}>
            <Text style={styles.label}>Isi</Text>
            <TextInput
              multiline
              onChangeText={setContent}
              placeholder="Tulis catatan di sini..."
              placeholderTextColor="#9aa7ad"
              style={[styles.input, styles.textArea]}
              textAlignVertical="top"
              value={content}
            />
          </View>

          <Button disabled={saving} icon={Save} onPress={handleSubmit}>
            {saving ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

function EmptyNotes({ onAdd }) {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyIcon}>
        <BookOpenText size={32} color={colors.primary} />
      </View>
      <Text style={styles.emptyTitle}>Belum ada catatan</Text>
      <Text style={styles.emptyText}>Tambahkan catatan pertama untuk melihat daftar CRUD.</Text>
      <Button icon={Plus} onPress={onAdd}>Tambah Catatan</Button>
    </View>
  );
}

function NotesScreen({ session }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  const email = session?.user?.email || '';

  const loadNotes = useCallback(async () => {
    const { data, error } = await supabase
      .from('notes')
      .select('id, title, content, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      Alert.alert('Gagal mengambil catatan', error.message);
      return;
    }

    setNotes(data || []);
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      await loadNotes();
      if (mounted) setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, [loadNotes]);

  async function refresh() {
    setRefreshing(true);
    await loadNotes();
    setRefreshing(false);
  }

  function openAdd() {
    setEditingNote(null);
    setModalVisible(true);
  }

  function openEdit(note) {
    setEditingNote(note);
    setModalVisible(true);
  }

  async function saveNote(values) {
    setSaving(true);

    const payload = {
      title: values.title,
      content: values.content,
      user_id: session.user.id,
    };

    const request = editingNote
      ? supabase
          .from('notes')
          .update({ title: payload.title, content: payload.content })
          .eq('id', editingNote.id)
      : supabase.from('notes').insert(payload);

    const { error } = await request;
    setSaving(false);

    if (error) {
      Alert.alert('Gagal menyimpan', error.message);
      return;
    }

    setModalVisible(false);
    setEditingNote(null);
    await loadNotes();
  }

  function confirmDelete(note) {
    Alert.alert('Hapus catatan?', `Catatan "${note.title}" akan dihapus.`, [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          const { error } = await supabase.from('notes').delete().eq('id', note.id);
          if (error) {
            Alert.alert('Gagal menghapus', error.message);
            return;
          }
          await loadNotes();
        },
      },
    ]);
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  const headerStats = useMemo(() => `${notes.length} catatan`, [notes.length]);

  return (
    <SafeAreaView style={styles.root}>
      <ExpoStatusBar style="dark" backgroundColor={colors.panel} translucent={false} />
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.kicker}>Hai, Selamat Datang</Text>
            <Text style={styles.title}>Catatan Saya</Text>
          </View>
          <View style={styles.headerActions}>
            <IconButton icon={Plus} label="Tambah catatan" onPress={openAdd} variant="primary" />
            <IconButton icon={LogOut} label="Keluar" onPress={signOut} />
          </View>
        </View>
        <Text style={styles.userText}>{session.user.email}</Text>
        <View style={styles.statPill}>
          <BookOpenText size={16} color={colors.primaryDark} />
          <Text style={styles.statText}>{headerStats}</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator color={colors.primary} />
          <Text style={styles.loadingText}>Memuat catatan...</Text>
        </View>
      ) : (
        <FlatList
          contentContainerStyle={notes.length ? styles.listContent : styles.emptyContent}
          data={notes}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<EmptyNotes onAdd={openAdd} />}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.primary} />
          }
          renderItem={({ item }) => (
            <View style={styles.noteCard}>
              <View style={styles.noteHeader}>
                <Text numberOfLines={2} style={styles.noteTitle}>
                  {item.title}
                </Text>
                <View style={styles.noteActions}>
                  <IconButton icon={Pencil} label="Ubah catatan" onPress={() => openEdit(item)} />
                  <IconButton
                    icon={Trash2}
                    label="Hapus catatan"
                    onPress={() => confirmDelete(item)}
                    variant="danger"
                  />
                </View>
              </View>
              <Text style={styles.noteDate}>{formatDate(item.created_at)}</Text>
              <Text style={styles.noteContent}>{item.content}</Text>
            </View>
          )}
        />
      )}

      <NoteModal
        initialNote={editingNote}
        onClose={() => {
          setModalVisible(false);
          setEditingNote(null);
        }}
        onSubmit={saveNote}
        saving={saving}
        visible={modalVisible}
      />
    </SafeAreaView>
  );
}

export default function App() {
  const [session, setSession] = useState(null);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setBooting(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setBooting(false);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (booting) {
    return (
      <SafeAreaView style={styles.bootRoot}>
        <ExpoStatusBar style="dark" backgroundColor={colors.bg} translucent={false} />
        <ActivityIndicator color={colors.primary} />
      </SafeAreaView>
    );
  }

  return session ? <NotesScreen session={session} /> : <AuthScreen />;
}

const styles = StyleSheet.create({
  root: {
    paddingTop: androidStatusBarHeight,
    flex: 1,
    backgroundColor: colors.bg,
  },
  bootRoot: {
    alignItems: 'center',
    backgroundColor: colors.bg,
    flex: 1,
    justifyContent: 'center',
    paddingTop: androidStatusBarHeight,
  },
  authRoot: {
    backgroundColor: colors.bg,
    flex: 1,
    paddingTop: androidStatusBarHeight,
  },
  authKeyboard: {
    flex: 1,
  },
  authContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  logoMark: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: colors.primary,
    borderRadius: 8,
    height: 70,
    justifyContent: 'center',
    marginBottom: 20,
    width: 70,
  },
  authTitle: {
    color: colors.ink,
    fontSize: 30,
    fontWeight: '800',
    textAlign: 'center',
  },
  authSubtitle: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 26,
    marginTop: 8,
    textAlign: 'center',
  },
  segment: {
    backgroundColor: '#e5ecef',
    borderRadius: 8,
    flexDirection: 'row',
    marginBottom: 20,
    padding: 4,
  },
  segmentItem: {
    alignItems: 'center',
    borderRadius: 6,
    flex: 1,
    paddingVertical: 10,
  },
  segmentActive: {
    backgroundColor: colors.panel,
  },
  segmentText: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '700',
  },
  segmentTextActive: {
    color: colors.ink,
  },
  field: {
    marginBottom: 16,
  },
  fieldGrow: {
    flex: 1,
    marginBottom: 16,
  },
  label: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.panel,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    color: colors.ink,
    fontSize: 16,
    minHeight: 50,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  inputWithIcon: {
    alignItems: 'center',
    backgroundColor: colors.panel,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    minHeight: 50,
    paddingHorizontal: 14,
  },
  flexInput: {
    color: colors.ink,
    flex: 1,
    fontSize: 16,
    minHeight: 48,
  },
  textArea: {
    flex: 1,
    minHeight: 220,
  },
  button: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 8,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    minHeight: 52,
    paddingHorizontal: 18,
  },
  buttonSecondary: {
    backgroundColor: colors.panel,
    borderColor: colors.border,
    borderWidth: 1,
  },
  buttonDanger: {
    backgroundColor: colors.danger,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  buttonTextSecondary: {
    color: colors.ink,
  },
  pressed: {
    opacity: 0.75,
  },
  disabled: {
    opacity: 0.55,
  },
  iconButton: {
    alignItems: 'center',
    backgroundColor: colors.panel,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  iconButtonPrimary: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  iconButtonDanger: {
    backgroundColor: colors.danger,
    borderColor: colors.danger,
  },
  header: {
    backgroundColor: colors.panel,
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    paddingBottom: 16,
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  headerTop: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  kicker: {
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  title: {
    color: colors.ink,
    fontSize: 26,
    fontWeight: '900',
  },
  userText: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 4,
  },
  statPill: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.soft,
    borderRadius: 8,
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  statText: {
    color: colors.primaryDark,
    fontSize: 13,
    fontWeight: '800',
  },
  loadingBox: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  loadingText: {
    color: colors.muted,
    marginTop: 10,
  },
  listContent: {
    padding: 16,
  },
  emptyContent: {
    flexGrow: 1,
    padding: 24,
  },
  noteCard: {
    backgroundColor: colors.panel,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
    padding: 16,
  },
  noteHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  noteTitle: {
    color: colors.ink,
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 24,
  },
  noteActions: {
    flexDirection: 'row',
    gap: 8,
  },
  noteDate: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 6,
  },
  noteContent: {
    color: colors.ink,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 12,
  },
  empty: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  emptyIcon: {
    alignItems: 'center',
    backgroundColor: colors.soft,
    borderRadius: 8,
    height: 66,
    justifyContent: 'center',
    marginBottom: 16,
    width: 66,
  },
  emptyTitle: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: '900',
  },
  emptyText: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 18,
    marginTop: 6,
    textAlign: 'center',
  },
  modalRoot: {
    backgroundColor: colors.bg,
    flex: 1,
    paddingTop: androidStatusBarHeight,
  },
  modalHeader: {
    alignItems: 'center',
    backgroundColor: colors.panel,
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  modalTitle: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: '900',
  },
  modalBody: {
    flex: 1,
    padding: 20,
  },
});
