import { Button, Text, TextInput, View } from "react-native";
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { UserCredsSchema, userCredsSchema } from "@/lib/zodSchemas";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/initFirebase";
import { useRouter } from "expo-router";

export default function SignUp() {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const router = useRouter()

  const {
    control,
    handleSubmit,
    formState: { errors, isLoading },
  } = useForm({
    resolver: zodResolver(userCredsSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit({ email, password }: UserCredsSchema) {
    await createUserWithEmailAndPassword(auth, email, password)
      .then(response => {
        // This function automatically signs a user in,
        // So its best to route directly to the homepage
        router.push("/(tabs)/")
      })
      .catch(error => {
        if (error instanceof Error)
          setErrorMsg(error.message)
      })
  }

  function onInvalid() {
    // Do something
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#f5f5f5' }}>
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#333' }}>
          Sign up for an account
        </Text>
      </View>

      <View style={{ width: '100%', marginBottom: 15 }}>
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={{
                width: '100%',
                padding: 10,
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 5,
                backgroundColor: 'white',
              }}
              placeholder="Your email"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
          name="email"
        />
        {errors.email && <Text style={{ color: 'red', marginTop: 5 }}>errors.email.message</Text>}
      </View>

      <View style={{ width: '100%', marginBottom: 20 }}>
        <Controller
          control={control}
          rules={{
            maxLength: 100,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={{
                width: '100%',
                padding: 10,
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 5,
                backgroundColor: 'white',
              }}
              placeholder="Password"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry
            />
          )}
          name="password"
        />
        {errors.password && <Text style={{ color: 'red', marginTop: 5 }}>{errors.password.message}</Text>}
      </View>

      <Button
        disabled={isLoading}
        title={isLoading ? "Loading.." : "Submit"}
        onPress={handleSubmit(onSubmit, onInvalid)}
        color="#007AFF"
      />
    </View>
  )
}