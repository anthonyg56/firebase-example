import { TodoItem } from "@/@types";
import { NGROK_STATIC_DOMAIN, NGROK_STATIC_DOMAIN_PORT } from "@/constants/env";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, Pressable } from "react-native";

export default function List() {
  const [list, setList] = useState<TodoItem[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { key } = useLocalSearchParams<{ key: string }>();

  console.log(key);

  useEffect(() => {
    fetchTodoItems();
  }, []);

  async function fetchTodoItems() {
    setError(null);
    setLoading(true);

    const response: TodoItem[] = await fetch(`http://10.0.0.45:8080/todos/${key}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Credentials": "withCredential",
      },
    })
      .then(response => {
        return response.json()
      })
      .catch(error => {
        console.log(error)
        if (error instanceof Error)
          setError(error.message);
      });

    const isArray = response instanceof Array;

    if (!isArray || response.length === 0) {
      setError("Invalid data provided");
      return
    };

    console.log(response);
    setList(response);
    setLoading(false);
  }

  console.log(list);

  if (loading === true) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ fontSize: 18, color: '#007AFF', fontWeight: 'bold' }}>
          Loading lists...
        </Text>
      </View>
    );
  } else if (error !== null) {
    return (
      <View style={{ padding: 20, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 18, color: 'red', marginBottom: 15, textAlign: 'center' }}>
          There appears to have been an error, please try again
        </Text>
        <Pressable
          onPress={fetchTodoItems}
          style={{
            backgroundColor: '#007AFF',
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 5
          }}
        >
          <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Reload</Text>
        </Pressable>
      </View>
    );
  } else {
    return (
      <View>
        {list.map(item => {
          return (
            <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#e0e0e0' }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>
                {item.text}
              </Text>
              <Text style={{
                fontSize: 14,
                color: item.complete ? 'green' : 'red',
                fontWeight: 'bold'
              }}>
                {item.complete ? "Complete" : "Incomplete"}
              </Text>
            </View>
          )
        })}
      </View>
    );
  };
};