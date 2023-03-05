import { View, Image, TouchableOpacity } from 'react-native';
import * as Constantes from '../Constantes';

export default function BotaoIcone({icone, eventoPress, tamanho = 28, cor = Constantes.CorPadrao, style}) {

  if (eventoPress) {
    return (
      <View style = {style}>  
        <TouchableOpacity onPress={eventoPress}>
            <Image style={{ width: tamanho, height: tamanho, tintColor: cor }} source={icone} />
        </TouchableOpacity> 
      </View>
    );  
  } else {
    return (
      <View style = {style}>  
        <Image style={{ width: tamanho, height: tamanho, tintColor: cor }} source={icone} />
      </View>
    );
  }
  
}