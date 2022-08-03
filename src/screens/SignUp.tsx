import React, { useState } from 'react'
import { Alert, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native'
import auth from '@react-native-firebase/auth'
import { VStack, Heading, Icon, useTheme, Box, Pressable, Text, IconButton, HStack } from 'native-base'
import Logo from '../assets/logo_primary.svg'
import { CaretLeft, Envelope, IdentificationBadge, Key } from 'phosphor-react-native'
import firestore from '@react-native-firebase/firestore'

import { Input } from '../components/Input'
import { Button } from '../components/Button'
import { useNavigation } from '@react-navigation/native'

export function SignUp() {
  const navigation = useNavigation()
  const [isLoading, setIsLoading] = useState(false); 
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const { colors } = useTheme();

  function handleSignUp() {
    if(!name || !email || !password || !passwordConfirm) {
      return Alert.alert('Cadastrar', 'Informe todos os campos.')
    }

    if (password !== passwordConfirm) {
      return Alert.alert('Cadastrar', 'As senhas devem ser iguais.')
    }

    setIsLoading(true)

    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        firestore()
          .collection('users')
          .add({
            name,
            email
          })
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('Este e-mail já está em uso!');
        }
    
        if (error.code === 'auth/invalid-email') {
          console.log('E-mail inválido!');
        }
    
        console.error(error);

        setIsLoading(false)

        return Alert.alert('Cadastrar', 'Não foi possível realizar seu cadastro.')
      });    
  }

  function handleSignIn() {
    navigation.navigate("signIn")
  }

  return(
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Box flex={1} bg="gray.600">        
        <KeyboardAvoidingView behavior="position" enabled>                  
          <VStack alignItems="center" px={8} pt={24}>

            <Logo />

            <Heading color="gray.100" fontSize="xl" mt={8} mb={6}>
              Realize seu cadastro
            </Heading>

            <Input 
              placeholder="Nome" 
              mb={4}
              InputLeftElement={<Icon as={<IdentificationBadge color={colors.gray[300]} />} ml={4} />}
              onChangeText={setName}
            />
            <Input 
              placeholder="E-mail" 
              mb={4}
              InputLeftElement={<Icon as={<Envelope color={colors.gray[300]} />} ml={4} />}
              onChangeText={setEmail}
            />
            <Input 
              mb={4}
              placeholder="Senha" 
              InputLeftElement={<Icon as={<Key color={colors.gray[300]} />} ml={4} />}
              secureTextEntry
              onChangeText={setPassword}
            />
            <Input 
              mb={8}
              placeholder="Confirme a senha" 
              InputLeftElement={<Icon as={<Key color={colors.gray[300]} />} ml={4} />}
              secureTextEntry
              onChangeText={setPasswordConfirm}
            />

            <Button 
              title='Cadastrar'
              mb={6}
              w="full" 
              onPress={handleSignUp} 
              isLoading={isLoading}
            />

            <Pressable mb={8}>
              <Text color="gray.100">
                Já possui uma conta?
                <Text onPress={handleSignIn} color="primary.700"> Entrar</Text>
              </Text>
            </Pressable>
          </VStack>  
        </KeyboardAvoidingView>
      </Box>
    </TouchableWithoutFeedback> 
  )
}