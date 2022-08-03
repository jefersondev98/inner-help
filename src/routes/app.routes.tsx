import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { Home } from '../screens/Home'
import { DetailsTicket } from '../screens/DetailsTicket'
import { CreateTicket } from '../screens/CreateTicket'

const { Navigator, Screen } = createNativeStackNavigator()

export function AppRoutes(){
  return(
    <Navigator 
      screenOptions={{
        headerShown: false,
        animation: "fade_from_bottom",
      }}
    >
      <Screen name="home" component={Home} />
      <Screen name="createTicket" component={CreateTicket} />
      <Screen name="detailsTicket" component={DetailsTicket} />
    </Navigator>
  )
}