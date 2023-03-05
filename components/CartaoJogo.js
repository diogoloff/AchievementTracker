import { useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, TouchableWithoutFeedback, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Yup from "yup"; 

import * as Constantes from '../Constantes';
import BotaoIcone from './BotaoIcone';
import CaixaTexto from './CaixaTexto';

const JogoSchema = Yup.object().shape({
  nome: Yup.string().required("Nome do Jogo é obrigatório").min(3, "Nome do Jogo deve ter no mínimo de 3 letras"),
});

function CartaoCadastro(novo, eventoPress, nomeJogo = "", imagemJogo = null, id = 0) {

  const [jogo, setJogo] = useState({id: id, nome: nomeJogo, imagem: imagemJogo});

  const setarTitulo = valor => {
    setJogo(valoresExistentes => ({
      ...valoresExistentes,
      nome: valor,
    }))
  }

  const setarImagem = valor => {
    setJogo(valoresExistentes => ({
      ...valoresExistentes,
      imagem: valor,
    }))
  }

  function retornaImagem() {
    return (
      jogo.imagem ? <View style={styles.imagem}><Image style={{ borderRadius: 10, width: 100, height: 100 }} source={{ uri: jogo.imagem }} /></View>  :
                    <View style={[styles.imagem, styles.imagemborda]}><Image style={{ width: 48, height: 48 }} source={Constantes.IconeAdicionarImagem} /></View> 
    );
  }

  async function openImagePickerAsync() {
    let pickerResult = await ImagePicker.launchImageLibraryAsync({base64:true});

    if (pickerResult.cancelled === true) {
      return;
    }
    setarImagem('data:image/png;base64,' + pickerResult.base64);  
  }

  return (  
    <View style={[styles.cartao, {backgroundColor: Constantes.CorFormulario}]}>
      <View style={styles.cabecalho}>
        <Text style={styles.titulocadastro}> {novo === true ? "Adicionar Jogo" : "Editar Jogo" }</Text> 
      </View>
      <View style={styles.conteudo}>
        <TouchableOpacity onPress={openImagePickerAsync}>
          {retornaImagem()}
        </TouchableOpacity>

        <View style={styles.camposcadastro}>
          <CaixaTexto label="Nome do Jogo" value={jogo.nome} onChangeText={setarTitulo} maxLength={30}/> 
          <View style={styles.botoescadastro}>
            {!novo && 
              <BotaoIcone style={{marginRight: 20}} icone={Constantes.IconeExcluir} tamanho={36} cor='red'
              eventoPress={() => {
                try {
                  eventoPress(jogo, true)
                } catch (error) {
                  Alert.alert('Atenção', error.message)  
                }
              }}/>
            }

            <BotaoIcone icone={Constantes.IconeSalvar}  tamanho={36} eventoPress={() => {
                try {
                  jogo.nome = jogo.nome.trim();
                  JogoSchema.validateSync(jogo);
                  eventoPress(jogo, false)
                } catch (error) {
                  Alert.alert('Atenção', error.message)  
                }
              }}/>
          </View> 
        </View>
      </View>     
    </View>
  );
}

function CartaoConsulta(item, eventoPress, eventoLongPress) {
  
  function corTrofeu() {
    if ((item.totalConcluidas === item.totalConquistas) && (item.totalConquistas > 0)) {
      return "#FFAB00";
    } else {
      return "#757575";
    }
  }

  function retornaImagem() {
    return (
      item.imagem ? <View style={styles.imagem}><Image style={{ borderRadius: 10, width: 100, height: 100 }} source={{ uri: item.imagem }} /></View>  :
                    <View style={[styles.imagem, styles.imagemborda]}><Image style={{ width: 48, height: 48 }} source={Constantes.IconeSemImagem} /></View> 

    );  
  }

  return (
    <View style={styles.cartao}>
      <TouchableWithoutFeedback onPress={eventoPress} onLongPress={eventoLongPress}>
        <View style={styles.conteudo}>
          {retornaImagem()}
          <View style={styles.texto}>
            <Text style={styles.titulo} >{ item.nome }</Text>
            <View style={styles.trofeu}>
              <Text style={styles.contador}>{item.totalConcluidas}/{item.totalConquistas}</Text>
              <BotaoIcone style={{marginLeft: 10}} icone={Constantes.IconeTrofeu} tamanho={36} cor={corTrofeu()} />
            </View>  
          </View>
        </View>
      </TouchableWithoutFeedback> 
    </View>  
  );
}

export default function CartaoJogo({ tipoTela = 'lista', item, eventoPress, eventoLongPress }) {
  if (tipoTela === 'lista') {
    return (
      CartaoConsulta(item, eventoPress, eventoLongPress)
    );
  } else {
    return (
      item ? CartaoCadastro(false, eventoPress, item.nome, item.imagem, item.id) : CartaoCadastro(true, eventoPress)
    );  
  }
}

const styles = StyleSheet.create({
  cartao: {
    borderRadius: 10,
    elevation: 3,
    backgroundColor: '#fff',
    shadowOffset: { width: 1, height: 1},
    shadowColor: '#333',
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginHorizontal: 10,
    marginVertical: 3,
  },  
  conteudo: {
    flexDirection: 'row',
    margin: 10,
  },
  imagem: {
    height: 100,
    width: 100,
    borderRadius: 10,
    alignItems: "center", 
    justifyContent: "center"
  },
  imagemborda: {
    borderWidth: 3,
    borderStyle: 'dashed',
    borderColor: '#666',
  },
  texto: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 10,
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  contador: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  trofeu: {
    flexDirection: 'row',
    alignItems: 'center' ,
    justifyContent: 'flex-end',
  },
  icone: {
    backgroundColor: '#fff' 
  },
  cabecalho: {
    marginTop: 10,
    alignItems: 'center' ,
  },
  titulocadastro: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  botoescadastro: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'flex-end',
  },
  camposcadastro: {
    flex: 1,
    paddingHorizontal: 10,
  },
});

