import { useState } from "react";
import { Button, Text, View } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/initFirebase";
import { useRouter } from "expo-router";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const router = useRouter();

  async function handleSignOut() {
    setErrorMsg(null);
    setLoading(true);

    try {
      await signOut(auth);
      router.navigate("/");
    } catch (error) {
      if (error instanceof Error) {
        setErrorMsg(error.message);
      }
    } finally {
      setLoading(true);
    };
  };

  if (loading === true) {
    return (
      <View>
        <Text>
          Signing you out..
        </Text>
      </View>
    );
  } else {
    return (
      <View>
        <Button
          onPress={handleSignOut}
          title="Sign out"
          color="red"
        />
        {errorMsg && (
          <View>
            <Text>
              errorMsg
            </Text>
          </View>
        )}
      </View>
    );
  };
};