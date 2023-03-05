import { StyleSheet, View } from "react-native";
import { List } from "react-native-paper";

import * as Constantes from '../Constantes';
import BotaoIcone from './BotaoIcone';

export default function ItemLista({ item, eventoPress, eventoLongPress, eventoPressCk }) {
    //const comprado = !!item?.comprado && item.comprado === "S";

  function corTrofeu() {
    if (item.concluida) {
      return "#FFAB00";
    } else {
      return "#757575";
    }
  }
  
  return (
    <List.Item
      title={item.nome}
      titleStyle={{ fontWeight: 'bold', color: '#fff' }} 
      description={item.descricao}
      descriptionStyle={{ fontStyle: "italic", color: '#fff' }} 
      style={styles.lista}
      onPress={eventoPress}
      onLongPress={eventoLongPress}
      rippleColor="rgba(60, 179, 113, .32)"
      left={props => (
        <View style={{ justifyContent: "center" }}>
          <View style={styles.itemCircular}>
            <BotaoIcone icone={Constantes.IconeTrofeu} tamanho={36} cor={corTrofeu()} eventoPress={eventoPressCk} />
          </View>
        </View>
      )}
    /> 
  );
}

const styles = StyleSheet.create({
  lista: {
    borderRadius: 10,
    elevation: 3,
    backgroundColor: Constantes.CorPadrao,
    shadowOffset: { width: 1, height: 1},
    shadowColor: '#333',
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginHorizontal: 10,
    marginVertical: 3,

    
  },  
  itemCircular: {
    backgroundColor: '#fff',
    marginRight: 5,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 25,
    overflow: "hidden",
  },
});