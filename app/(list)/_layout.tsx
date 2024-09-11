import { Stack } from "expo-router";

export default function _Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="/(tabs)/(list)/[key]"
      />
    </Stack>
  )
}