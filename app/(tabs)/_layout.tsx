import { Tabs } from "expo-router";

export default function _Layout() {

  return (
    <Tabs>
      <Tabs.Screen
        name="/(tabs)/"
      />
      <Tabs.Screen
        name="/(tabs)/signout"
      />
    </Tabs>
  )
}