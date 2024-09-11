import { TodoItem, TodosList } from "@/@types";
import { NGROK_STATIC_DOMAIN } from "@/constants/env";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { Pressable, Text, View } from "react-native";

export default function Home() {
  const [list, setList] = useState<Map<string, TodoItem[]>>(new Map());

  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    fetchTodoList();
  }, []);

  async function fetchTodoList() {
    setError(null);
    setLoading(true);

    const response: TodosList = await fetch(`http://10.0.0.45:8080/todos`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(response => {
        console.log(response)
        return response.json()
      })
      .catch(error => {
        console.log(error)
        if (error instanceof Error)
          setError(error);
      });


    response && Object.keys(response).forEach((key) => {
      const newMap = list.set(key, response[key]);

      setList(newMap);
    })

    setLoading(false);
  };

  function handleRouteChange(key: string) {
    router.push(`/(list)/${key}`);
  };

  if (loading === true) {
    return (
      <View>
        <Text>
          Loading lists...
        </Text>
      </View>
    );
  } else if (error !== null) {
    return (
      <View>
        <Text>
          There appears to have been an error, please try again
        </Text>
        <Pressable onPress={fetchTodoList}>
          <Text>Reload</Text>
        </Pressable>
      </View>
    );
  } else {
    return (
      <View>
        {
          // Have to itterate this way since its a map and not an array
          [...list.keys()].map(key => {
            return (
              <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#e0e0e0' }}>
                <Pressable
                  onPress={event => handleRouteChange(key)}
                  style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                    {key}
                  </Text>
                  <Text style={{ fontSize: 14, color: '#007AFF' }}>
                    {list.get(key)?.length} Tasks
                  </Text>
                </Pressable>
              </View>
            );
          })
        }
      </View>
    );
  };
};