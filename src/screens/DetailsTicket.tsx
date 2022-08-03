import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { VStack, Text, HStack, useTheme, ScrollView, Box } from 'native-base';
import { Header } from '../components/Header';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { TicketProps } from '../components/Ticket';

import firestore from '@react-native-firebase/firestore'
import { TicketFirestoreDTO } from '../DTOs/TicketFirestoreDTO';
import { dateFormat } from '../utils/firestoreDateFormat';
import { Loading } from '../components/Loading';
import { CircleWavyCheck, Hourglass, DesktopTower, ClipboardText } from 'phosphor-react-native'
import { CardDetailsTicket } from '../components/CardDetailsTicket'


type RouteParams = {
  ticketId : string;
}

type ticketDetailsTicket = TicketProps & {
  title: string;
  description: string;
  solution: string;
  closed: string;
}

export function DetailsTicket() {
  const [solution, setSolution] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [ticket, setTicket] = useState<ticketDetailsTicket>({} as ticketDetailsTicket)

  const navigation = useNavigation()
  const { colors } = useTheme();
  const route = useRoute()
  const { ticketId } = route.params as RouteParams


  function handleticketClose() {
    if(!solution) {
      return Alert.alert('Ticket', 'Informe a solução para encerrar o Ticket.')
    }

    firestore()
      .collection('tickets')
      .doc(ticketId)
      .update({
        status: 'closed',
        solution,
        closed_at: firestore.FieldValue.serverTimestamp()
      })
      .then(() => {
        Alert.alert('Ticket', 'Ticket encerrado.')
        navigation.goBack()
      })
      .catch((error) => {
        console.log(error)
        Alert.alert('Ticket', 'Não foi possível encerrar o Ticket.')
      })
  }

  useEffect(() => {
    firestore()
      .collection<TicketFirestoreDTO>('tickets')
      .doc(ticketId)
      .get()
      .then((doc) => {
        const { title, patrimony_number, description, status, created_at, closed_at, solution } = doc.data();
        const closed = closed_at ? dateFormat(closed_at) : null

        setTicket({
          id: doc.id,
          title,
          patrimony_number,
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
          ticket.status === 'closed' 
            ? <CircleWavyCheck size={22} color={colors.blue[300]} />
            : <Hourglass size={22} color={colors.secondary[700]} />
        }

        <Text
          fontSize="sm"
          color={ticket.status ==='closed' ? colors.blue[300] : colors.secondary[700]}
          ml={2}
          textTransform="uppercase"
        >
          {ticket.status === 'closed' ? 'finalizado' : 'em andamento'}          
        </Text>        
      </HStack>

      <ScrollView mx={5} showsVerticalScrollIndicator={false}>
          <CardDetailsTicket 
            title="equipamentos"
            description={`Patrimônio ${ticket.patrimony_number}`}
            icon={DesktopTower}
            footer={ticket.when}
          />

          <CardDetailsTicket 
            title="descrição do problema"
            description={ticket.description}
            icon={ClipboardText}
          />

          <CardDetailsTicket 
            title="solução"
            icon={CircleWavyCheck}
            description={ticket.solution}
            footer={ticket.closed && `Encerrado em ${ticket.closed}`}
          >
            { ticket.status === 'open' &&
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
        ticket.status === 'open' && 
        <Button 
          title="Encerrar Ticket"
          m={5}
          onPress={handleticketClose}
        />
      }
    </VStack>
  );
}