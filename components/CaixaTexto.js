import { StyleSheet, Text, View } from 'react-native';
import { TextInput } from 'react-native-paper';

import * as Constantes from '../Constantes';

export default function CaixaTexto({ erro = null, ...propriedades }) {

  return (
    <View style={styles.formatacaixa}>
      <TextInput error={!!erro} style={{backgroundColor: '#fff', fontSize: 16}}
      mode='flat' activeUnderlineColor={Constantes.CorPadrao} underlineColor={Constantes.CorPadrao} selectionColor={Constantes.CorTextoSelecionado}
      {...propriedades} />
      {!!erro && typeof erro === "string" && <Text style={styles.formataerro}>{erro}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  formatacaixa: {
    paddingBottom: 6,
    shadowOffset: { width: 1, height: 0},
    shadowColor: '#333',
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },  
  formataerro: {
    fontSize: 13,
    color: "#C00",
    paddingVertical: 5,
    paddingHorizontal: 9,
  },
});