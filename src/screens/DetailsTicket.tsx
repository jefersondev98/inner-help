import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { VStack, Text, HStack, useTheme, ScrollView, Box } from 'native-base';
import { Header } from '../components/Header';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { OrderProps } from '../components/Order';

import firestore from '@react-native-firebase/firestore'
import { OrderFirestoreDTO } from '../DTOs/OrderFirestoreDTO';
import { dateFormat } from '../utils/firestoreDateFormat';
import { Loading } from '../components/Loading';
import { CircleWavyCheck, Hourglass, DesktopTower, ClipboardText } from 'phosphor-react-native'
import { CardDetailsTicket } from '../components/CardDetailsTicket'


type RouteParams = {
  orderId : string;
}

type OrderDetailsTicket = OrderProps & {
  description: string;
  solution: string;
  closed: string;
}

export function DetailsTicket() {
  const [solution, setSolution] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [order, setOrder] = useState<OrderDetailsTicket>({} as OrderDetailsTicket)

  const navigation = useNavigation()
  const { colors } = useTheme();
  const route = useRoute()
  const { orderId } = route.params as RouteParams


  function handleOrderClose() {
    if(!solution) {
      return Alert.alert('Ticket', 'Informa a solução para encerrar a ticket.')
    }

    firestore()
      .collection('ticket')
      .doc(orderId)
      .update({
        status: 'closed',
        solution,
        closed_at: firestore.FieldValue.serverTimestamp()
      })
      .then(() => {
        Alert.alert('Ticket', 'Ticket encerrada.')
        navigation.goBack()
      })
      .catch((error) => {
        console.log(error)
        Alert.alert('Ticket', 'Não foi possível encerrar a solicatação.')
      })
  }

  useEffect(() => {
    firestore()
      .collection<OrderFirestoreDTO>('ticket')
      .doc(orderId)
      .get()
      .then((doc) => {
        const { patrimony, description, status, created_at, closed_at, solution } = doc.data();
        const closed = closed_at ? dateFormat(closed_at) : null

        setOrder({
          id: doc.id,
          patrimony,
          description,
          status,
          solution,
          when: dateFormat(created_at),
          closed
        })

        setIsLoading(false)
      })
  },[])

  if (isLoading) {
    return <Loading />
  }

  return (
    <VStack flex={1} bg='gray.700'>
      
      <Box px={6} bg="gray.600">
        <Header title='Ticket'/>
      </Box>
      
      
      <HStack bg="gray.500" justifyContent="center" p={4}>
        {
          order.status === 'closed' 
            ? <CircleWavyCheck size={22} color={colors.blue[300]} />
            : <Hourglass size={22} color={colors.secondary[700]} />
        }

        <Text
          fontSize="sm"
          color={order.status ==='closed' ? colors.blue[300] : colors.secondary[700]}
          ml={2}
          textTransform="uppercase"
        >
          {order.status === 'closed' ? 'finalizado' : 'em andamento'}          
        </Text>        
      </HStack>

      <ScrollView mx={5} showsVerticalScrollIndicator={false}>
          <CardDetailsTicket 
            title="equipamentos"
            description={`Patrimônio ${order.patrimony}`}
            icon={DesktopTower}
            footer={order.when}
          />

          <CardDetailsTicket 
            title="descrição do problema"
            description={order.description}
            icon={ClipboardText}
          />

          <CardDetailsTicket 
            title="solução"
            icon={CircleWavyCheck}
            description={order.solution}
            footer={order.closed && `Encerrado em ${order.closed}`}
          >
            { order.status === 'open' &&
              <Input 
              placeholder='Desrição da solução'
              onChangeText={setSolution}
              h={24}
              textAlignVertical="top"
              multiline
              /> 
            }
            
          </CardDetailsTicket>
      </ScrollView>

      {
        order.status === 'open' && 
        <Button 
          title="Encerrar ticket"
          m={5}
          onPress={handleOrderClose}
        />
      }
    </VStack>
  );
}