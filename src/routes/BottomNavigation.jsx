import Settings from "../Screens/Settings";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { createMaterialBottomTabNavigator } from "react-native-paper/react-navigation";
import Customers from "../Screens/Customers";
import { useTheme } from "react-native-paper";

const Tab = createMaterialBottomTabNavigator();

const TabsNavigator = () => {
  const theme = useTheme();
  return (
    <Tab.Navigator barStyle={{ backgroundColor: theme.colors.background2 }}>
      <Tab.Screen
        name="Customers"
        component={Customers}
        options={{
          tabBarLabel: "Clientes",
          tabBarIcon: ({ color }) => (
            <Icon name="account-group" color={color} size={23} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarLabel: "Configuración",

          tabBarIcon: ({ color }) => (
            <Icon name="cog" color={color} size={23} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabsNavigator;
