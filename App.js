/* Anotações sobre observações no aplicativo 
    * Porque na tela de cadastro de conquistas não respeita o tamanho das views,
      gostaria que a tela ocupasse o máximo do tamanho possivel, já tentado com Flex, com Height 100%, nada surte efeito;

    * Também na tela de cadastro de conquistas eu queria que a barra de gravar ficassem em baixo da tela sempre, 
      tentei varias soluções porem o componente do teclado buga no IOS, já no Android funciona bem;

    * No IOS o numberoflines não funciona para campos de multiplas linhas, tentado fazer crescer porem tem problemas
      Não respeita o tamanho lido no onContentSizeChange não corresponde ao tamanho do campo corretamente
      tentado criar uma lógica que pegasse o valor e multiplicasse pelo numero de linhas necessárias, porem sempre fica menor
      se multiplicado pelo PixelRatio fica muito maior, para setar no minHeight e maxHeight não econtrei solução;

    * No mesmo campo quando tem multiplas linhas não seleciona a cor correta do texto conforme indicado pa propriedade selectionColor;
*/

/* Desenvolvimento Futuro
    * Transformar a tela de Jogos em uma tab para a principal com todos os jogos e uma secundária com os favoritos
    * Tela dos objetivos, que seria abaixo das conquistas, onde cada conquista ter uma lista de objetivos em formato de checkbox
*/

import { useState } from 'react';
import { Provider as PaperProvider } from 'react-native-paper'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Jogos from './screens/Jogos';
import Conquistas from './screens/Conquistas';
import ConquistasCadastro from './screens/ConquistasCadastro';
import Objetivos from './screens/Objetivos';

import Globais from './Globais';

const Stack = createNativeStackNavigator();

export default function App() {
  const[jogo, setJogo] = useState(null);

  return (
    
    <Globais.Provider value={{jogo, setJogo}}>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Jogos">
            <Stack.Screen name="Jogos" component={Jogos} />
            <Stack.Screen name="Conquistas" component={Conquistas} />
            <Stack.Screen name="ConquistasCadastro" component={ConquistasCadastro} />
            <Stack.Screen name="Objetivos" component={Objetivos} />
          </Stack.Navigator> 
        </NavigationContainer>
      </PaperProvider>
    </Globais.Provider>
  );
}
