import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { HStack, IconButton, VStack, useTheme, Text, Heading, FlatList, Center } from 'native-base';
import { SignOut } from 'phosphor-react-native'
import { ChatTeardropText } from 'phosphor-react-native'
import auth from '@react-native-firebase/auth'
import { Alert } from 'react-native'
import firestore from '@react-native-firebase/firestore'

import Logo from '../assets/logo_secondary.svg'

import { Filter } from '../components/Filter'
import { Button } from '../components/Button'
import { Order, OrderProps } from '../components/Order'
import { Loading } from '../components/Loading';

import { dateFormat } from '../utils/firestoreDateFormat'

export function Home() {
  const [isLoaging, setIsLoading] = useState(true)
  const [statusSelected, setStatusSelected] = useState<'open' | 'closed'>('open')

  const [ticket, setTicket] = useState<OrderProps[]>([])

  const navigation = useNavigation()
  const { colors } = useTheme()

  function handleNewOrder(){
    navigation.navigate('new')
  }

  function handleOpenDetailsTicket(orderId: string){
    navigation.navigate('details', { orderId })
  }

  function handleLogout() {
    auth()
    .signOut()
    .catch(error => {
      console.log(error)
      return Alert.alert('Sair', 'Não foi possível sair.')
    })
  }

  useEffect(() => {
    setIsLoading(true)

    const subscriber = firestore()
      .collection('ticket')
      .where('status', '==', statusSelected)
      .onSnapshot(snapshot => {
        const data = snapshot.docs.map(doc => {
          const { patrimony, description, status, created_at } = doc.data()
          
          return {
            id: doc.id,
            patrimony: patrimony,
            description: description,
            status: status,
            when: dateFormat(created_at)
          }
        })
        setTicket(data)
        setIsLoading(false)
      })

      return subscriber
  }, [statusSelected])

  return (
    <VStack flex={1} pb={6} bg="gray.700"> 
      <HStack
        w="full"
        justifyContent="space-between"
        alignItems="center"
        bg='gray.600'
        pt={12}
        pb={5}
        px={6}
      >

      <Logo />

      <IconButton 
        icon={<SignOut size={26} color={colors.primary[700]} />}  
        onPress={handleLogout}
      />

      </HStack>
      
      <VStack flex={1} px={6}>
        <HStack w='full' mt={8} mb={4} justifyContent='space-between' alignItems='center'>
          <Heading color='gray.100'>
            Tickets
          </Heading>
          <Text color='gray.200'>
            {ticket.length}
          </Text>
        </HStack>

        <HStack space={3} mb={8}>
          <Filter 
            type='open'
            title='Em andamento'
            onPress={() => setStatusSelected('open')}
            isActive={statusSelected === 'open'}
          />

          <Filter 
            type='closed'
            title='Finalizados'
            onPress={() => setStatusSelected('closed')}
            isActive={statusSelected === 'closed'}
          />
        </HStack>

        {
          isLoaging ? <Loading /> :
          <FlatList 
            data={ticket}
            keyExtractor={item => item.id}
            renderItem={({ item }) => <Order data={item} onPress={() => (handleOpenDetailsTicket(item.id))}/>}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            ListEmptyComponent={() => (
              <Center>
                <ChatTeardropText color={colors.gray[300]} size={40}/>
                <Text color='gray.300' fontSize='xl' mt={6} textAlign='center'>
                  Você não possui {'\n'}
                  tickets {statusSelected === 'open' ? 'abertos' : 'finalizados'}
                </Text>
              </Center>
            )}
          />
        }

        <Button title='Novo ticket' onPress={handleNewOrder} />

      </VStack>
    </VStack>
  );
}