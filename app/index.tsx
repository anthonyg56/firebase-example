import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button, Pressable, Text, View } from "react-native";

import { Link, useRouter } from "expo-router";
import { app } from "@/lib/initFirebase";
import { userCredsSchema } from "@/lib/zodSchemas";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { AuthErrorCodes, getAuth, signInWithEmailAndPassword, } from "firebase/auth";
import { ZodError } from "zod";

const auth = getAuth(app);

export default function Index() {
  // Input States
  const [email, setEmail] = useState('');
  const [password, setPassowrd] = useState('');

  // Error States
  const [errorField, setErrorField] = useState<"email" | "password" | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Control States
  const [loading, setloading] = useState(false);

  const router = useRouter();

  async function handleSignIn() {
    setloading(true);

    try {
      // Input validation
      const value = userCredsSchema.parse({
        email,
        password,
      });

      const res = await signInWithEmailAndPassword(auth, value.email, value.password)
        .then(data => {
          return data
        })
        .catch(error => {
          switch (error.code) {
            case AuthErrorCodes.INVALID_EMAIL || AuthErrorCodes.NULL_USER:
              setErrorField("email");
              setErrorMessage("Account not found");
              return null;
            case AuthErrorCodes.INVALID_LOGIN_CREDENTIALS || AuthErrorCodes.REJECTED_CREDENTIAL:
              setErrorField("email");
              setErrorMessage("Invalid User Credentials");
              return null;
            case AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER:
              setErrorField("email");
              setErrorMessage("Too many failed login attempt, please try again later");
              return null;
            default:
              setErrorField("email");
              setErrorMessage("Oops! There was an error, please try again.");
              return null;
          }
        });

      if (res === null)
        return;

      router.navigate('/(tabs)/')
    } catch (error) {
      if (error instanceof ZodError) {
        switch (error.errors[0].path[0]) {
          case "email":
            setErrorField("email");
            setErrorMessage(error.errors[0].message);
            return
          case "password":
            setErrorField("password");
            setErrorMessage(error.errors[0].message);
          default:
            setErrorField("email");
            setErrorMessage("It seems we ran into an error, pelase try again.");
            return
        }
      }
    } finally {
      setloading(false)
    };
  }

  function handleStackChange() {
    router.push("/signup")
  }

  if (loading === true) {

  }
  return (
    <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
          backgroundColor: '#f5f5f5',
        }}
      >
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333' }}>Sign In</Text>
        <Input
          placeholder="Email@email.com"
          value={email}
          onChangeText={setEmail}
          style={{
            width: '100%',
            marginBottom: 10,
            backgroundColor: 'white',
            borderRadius: 5,
            padding: 10,
          }}
        />
        {errorField === "email" && (
          <Text style={{ color: 'red', marginBottom: 10 }}>
            {errorMessage}
          </Text>
        )}
        <Input
          placeholder="********"
          value={password}
          onChangeText={setPassowrd}
          secureTextEntry
          style={{
            width: '100%',
            marginBottom: 10,
            backgroundColor: 'white',
            borderRadius: 5,
            padding: 10,
          }}
        />
        {errorField === "password" && (
          <Text style={{ color: 'red', marginBottom: 10 }}>
            {errorMessage}
          </Text>
        )}
        <Button
          title="Sign in"
          onPress={handleSignIn}
          color="#007AFF"
          style={{ width: '100%', marginBottom: 10 }}
        />
        <Button
          title="Sign up"
          onPress={handleStackChange}
          color="#4CD964"
          style={{ width: '100%' }}
        />
      </View>
    </KeyboardAwareScrollView>
  );
}
