import "~/global.css"
import { Stack } from "expo-router";
import { onAuthStateChanged, User } from "firebase/auth";
import { createContext, useState, useMemo, useEffect } from "react";
import { auth } from "@/lib/initFirebase";

export interface IAuthContext {
  user: User,
  userId: string,
};

export const AuthContext = createContext<Partial<IAuthContext>>({});

export default function RootLayout() {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [userId, setUserId] = useState<string | undefined>(undefined);

  useEffect(() => {
    async function watchAuth() {
      onAuthStateChanged(auth, function (authenticatedUser) {
        // First if statement block only runs on the first render
        if (auth.currentUser !== null && user === null) {
          setUser(auth.currentUser);
          setUserId(auth.currentUser.uid);

          return
        } else if (authenticatedUser) {
          setUser(authenticatedUser);
          setUserId(authenticatedUser.uid);
        } else {
          setUser(undefined);
          setUserId(undefined);
        };
      });
    };

    watchAuth()
  }, [user]);

  const memoizedContextValues = useMemo(
    () => ({
      user,
      userId
    }),
    [user]
  );

  return (
    <AuthContext.Provider value={memoizedContextValues}>
      {
        user ? (
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="/(tabs)/list/" options={{ headerShown: false }} />
          </Stack>
        ) : (
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="signup" options={{ headerShown: false }} />
          </Stack>
        )
      }
    </AuthContext.Provider >
  );
};
