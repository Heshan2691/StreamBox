import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, View } from "react-native";
import "react-native-reanimated";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

// Import from source - using relative path from app directory
const { store, persistor, RootNavigator } = require("../src/index");

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate
        loading={
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" color="#007AFF" />
          </View>
        }
        persistor={persistor}
      >
        <RootNavigator />
        <StatusBar style="auto" />
      </PersistGate>
    </Provider>
  );
}
