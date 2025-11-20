// apps/mycpo/app/auth.tsx
import { useState } from 'react';
import { Alert, View, TextInput } from 'react-native';
import { supabase } from '@mycsuite/auth';
import { SharedButton } from '@mycsuite/ui';

export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    // Use the returned `data` to determine whether Supabase created a
    // session immediately (auto-login) or sent a confirmation email
    // (no session). If no session is returned we will show a message
    // asking the user to check their email and avoid redirecting.
    // Build a redirect URL for confirmation emails. Use the public site
    // URL from env so it works across environments. If not provided,
    // default to `http://localhost:8081` (web dev server).
    const redirectTo = `${process.env.EXPO_PUBLIC_SITE_URL ?? 'http://localhost:8081'}/auth`;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: redirectTo },
    });
    if (error) {
      Alert.alert('Sign up error', error.message);
      return;
    }

    // If Supabase returned a session the user is already logged in.
    // Otherwise, a confirmation email was sent and we should ask the
    // user to verify their address instead of proceeding.
    if (data?.session) {
      Alert.alert('Signed up', 'You are signed in.');
    } else {
      Alert.alert('Check your email', 'We sent a confirmation link — follow it to complete sign up.');
    }
  };

  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) Alert.alert(error.message);
  };

  return (
    <View className="flex-1 justify-center p-4">
      <TextInput
        className="p-3 mb-4 border border-gray-300 rounded-lg bg-white text-black"
        placeholder="Email"
        placeholderTextColor="#9CA3AF"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        className="p-3 mb-4 border border-gray-300 rounded-lg bg-white text-black"
        placeholder="Password"
        placeholderTextColor="#9CA3AF"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />
      <SharedButton title="Sign In" onPress={handleSignIn} />
      <SharedButton title="Sign Up" onPress={handleSignUp} />
    </View>
  );
}