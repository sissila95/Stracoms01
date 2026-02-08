import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '../theme/colors';
import { useApp } from '../context/AppContext';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export default function AuthScreen({ navigation }: Props) {
  const { login, register } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = () => {
    if (isLogin) {
      if (!email.trim() || !password.trim()) {
        Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
        return;
      }
      login(email, password);
      navigation.goBack();
    } else {
      if (!fullName.trim() || !email.trim() || !phone.trim() || !password.trim()) {
        Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
        return;
      }
      register({ fullName, email, phone });
      navigation.goBack();
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={28} color={Colors.text} />
        </TouchableOpacity>

        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Ionicons name="bed" size={40} color={Colors.textLight} />
          </View>
          <Text style={styles.appName}>Congo Booking</Text>
          <Text style={styles.appSubtitle}>
            Hôtels & Appartements à Brazzaville
          </Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, isLogin && styles.tabActive]}
            onPress={() => setIsLogin(true)}
          >
            <Text style={[styles.tabText, isLogin && styles.tabTextActive]}>
              Connexion
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, !isLogin && styles.tabActive]}
            onPress={() => setIsLogin(false)}
          >
            <Text style={[styles.tabText, !isLogin && styles.tabTextActive]}>
              Inscription
            </Text>
          </TouchableOpacity>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {!isLogin && (
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color={Colors.textSecondary} />
              <TextInput
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Nom complet"
                placeholderTextColor={Colors.textSecondary}
                autoCapitalize="words"
              />
            </View>
          )}

          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color={Colors.textSecondary} />
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Adresse email"
              placeholderTextColor={Colors.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {!isLogin && (
            <View style={styles.inputContainer}>
              <Ionicons name="call-outline" size={20} color={Colors.textSecondary} />
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="Téléphone (+242 ...)"
                placeholderTextColor={Colors.textSecondary}
                keyboardType="phone-pad"
              />
            </View>
          )}

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={Colors.textSecondary} />
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Mot de passe"
              placeholderTextColor={Colors.textSecondary}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={Colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {isLogin && (
            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitText}>
              {isLogin ? 'Se connecter' : 'S\'inscrire'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Social divider */}
        <View style={styles.dividerRow}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>ou continuer avec</Text>
          <View style={styles.divider} />
        </View>

        {/* Social buttons */}
        <View style={styles.socialRow}>
          <TouchableOpacity style={styles.socialButton}>
            <Ionicons name="logo-google" size={22} color={Colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Ionicons name="logo-facebook" size={22} color="#1877F2" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Ionicons name="logo-apple" size={22} color={Colors.text} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 56,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 4,
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  appName: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.primary,
  },
  appSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  tabActive: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.textLight,
  },
  form: {},
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotText: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  submitText: {
    color: Colors.textLight,
    fontSize: 16,
    fontWeight: '700',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginHorizontal: 12,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 40,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
});
