// App.js prueba
import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { AppProvider } from './AppContext';
import FirebaseLogin from './firebase-login/FirebaseLogin';
import FirebaseCrearCuenta from './firebase-login/FirebaseCrearCuenta';
import FirebaseRecuperarCuenta from './firebase-login/FirebaseRecuperarCuenta';
import PrincipalScreen from './screens/PrincipalScreen';
import CapitalScreen from './screens/CapitalScreen';
import EgresosScreen from './screens/EgresosScreen';
import HistorialScreen from './screens/HistorialScreen';

const AuthStack = createStackNavigator();
function AuthStackNavigator({ setIsLoggedIn }) {
  return (
    <AuthStack.Navigator initialRouteName="Login">
      <AuthStack.Screen name="Login">
        {(props) => <FirebaseLogin {...props} setIsLoggedIn={setIsLoggedIn} />}
      </AuthStack.Screen>
      <AuthStack.Screen name="CrearCuenta" component={FirebaseCrearCuenta} />
      <AuthStack.Screen name="RecuperarCuenta" component={FirebaseRecuperarCuenta} />
    </AuthStack.Navigator>
  );
}

const Drawer = createDrawerNavigator();
function AppDrawerNavigator() {
  return (
    <Drawer.Navigator initialRouteName="Principal">
      <Drawer.Screen name="Principal" component={PrincipalScreen} />
      <Drawer.Screen name="Ingresos" component={CapitalScreen} />
      <Drawer.Screen name="Egresos" component={EgresosScreen} />
      {/*<Drawer.Screen name="Historial" component={HistorialScreen} />*/}
    </Drawer.Navigator>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <AppProvider>
      <NavigationContainer>
        {isLoggedIn ? (
          <AppDrawerNavigator />
        ) : (
          <AuthStackNavigator setIsLoggedIn={setIsLoggedIn} />
        )}
      </NavigationContainer>
    </AppProvider>
  );
}
