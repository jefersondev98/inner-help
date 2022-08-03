import { useState } from 'react';
import { VStack } from 'native-base';
import { Header } from '../components/Header';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Alert } from 'react-native'
import firestore from '@react-native-firebase/firestore'
import { useNavigation } from '@react-navigation/native';

export function CreateTicket() {
  const [isLoading, setIsLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [patrimony_number, setPatrimony] = useState('')
  const [description, setDescription] = useState('')

  const navigation = useNavigation()

  function handleNewTicket() {
    if(!patrimony_number || !description) {
      return Alert.alert('Registrar', 'Preencha todos os campos.')
    }

    setIsLoading(true)

    firestore()
      .collection('tickets')
      .add({
        title,
        patrimony_number,
        description,
        status: 'open',
        created_at: firestore.FieldValue.serverTimestamp()
      })
      .then(() => {
        Alert.alert('Ticket', 'Ticket registrada com sucesso.')
        navigation.goBack()
      })
      .catch((error) => {
        console.log(error)
        setIsLoading(false)
        return Alert.alert('Ticket', 'Não foi possível registrar o pedido.')
      })
  }

  return (
    <VStack flex={1} p={6} bg='gray.600'>
      <Header title="Novo Ticket"/>

      <Input 
        placeholder='Título'
        mt={4}
        onChangeText={setTitle}
      />

      <Input 
        placeholder='Número do patrimônio'
        mt={4}
        onChangeText={setPatrimony}
      />

      <Input
        placeholder='Descrição do problema'
        flex={1}
        mt={5}
        multiline
        textAlignVertical='top'
        onChangeText={setDescription}
      />

      <Button 
        title='Registrar'
        mt={5}
        isLoading={isLoading}
        onPress={handleNewTicket}
      />
    </VStack>
  );
}