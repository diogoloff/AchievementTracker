import { useEffect, useState, useContext } from 'react';
import { FlatList, View, Alert } from 'react-native';

import { executeSql } from "../db";

import * as Constantes from '../Constantes';
import Globais from '../Globais';
import BotaoIcone from '../components/BotaoIcone';
import BotaoNovo from '../components/BotaoNovo';
import CartaoJogo from '../components/CartaoJogo';
import ItemLista from '../components/ItemLista';

export default function Conquistas({ route, navigation }) {

  /* Armazena o Jogo atual para controles de edição */
  const { jogo, setJogo } = useContext(Globais);

  /* Lista das Conquistas  */
  const [listaConquistas, setListaConquistas] = useState([]);

  const setarTotalConquistas = valor => {
    setJogo(valoresExistentes => ({
      ...valoresExistentes,
      totalConquistas: valor,
    }))
  }

  const setarTotalConcluidas = valor => {
    setJogo(valoresExistentes => ({
      ...valoresExistentes,
      totalConcluidas: valor,
    }))
  }

  /* Carrega a lista de conquistas para a tela */
  async function carregarConquistas() {
    const rs = await executeSql("SELECT id, idjogo, nome, descricao, concluida FROM conquistas WHERE idjogo = ? ORDER BY id", [jogo.id]); 
    let concluidas = rs.rows._array.filter(e => e.concluida === 1);
 
    setarTotalConquistas(rs.rows._array.length);
    setarTotalConcluidas(concluidas.length);
    setListaConquistas(rs.rows._array);
  }

  /* Função que deleta uma conquista no banco de dados */
  async function excluirConquista(item) {
    try {
      await executeSql("DELETE FROM objetivos where idconquista = ?", [item.id]);
      await executeSql("DELETE FROM conquistas where id = ?", [item.id]);
      carregarConquistas();
    } catch (err) {
      console.error(err);
    }    
  }

  /* Função que verifica se uma conquista em objetivos relacionados */
  async function existemObjetivos(item) {
    try {
      const rs = await executeSql("SELECT id FROM objetivos where idconquista = ?", [item.id]);
      if (rs.rows._array.length > 0) {
        Alert.alert(
          "Atenção",
          "Existem objetivos atrelados a esta conquista, excluir mesmo assim?",
          [{text: "Cancelar", style: "cancel"},
           {text: "OK", onPress: () => excluirConquista(item)}], 
          { cancelable: false }
        );   
      }
      else {
        excluirConquista(item);  
      }
    } catch (err) {
      console.error(err);
    }    
  } 

  /* Função que prepara para excluir conquista */
  function prepararExclusaoConquista(item) {
    Alert.alert(
      "Remover Conquista\n" + item.nome,
      "Você confirma a exclusão desta conquista?",
      [{text: "Cancelar", style: "cancel"},
        {text: "OK", onPress: () => existemObjetivos(item)}], 
      { cancelable: false }
    );      
  }

  /* Função que seta consquista concluida */
  async function setarConcluida(item) {
    try {
      const rs = await executeSql("UPDATE conquistas SET concluida = ? where id = ?", [item.concluida, item.id]);
      carregarConquistas();
    } catch (err) {
      console.error(err);
    }    
  }

  /* Se a tela estiver vazia monta um botão grande de adicionar */
  function abreVazio() {
    if (listaConquistas.length === 0) {
      return (
        <View style={{flex: 1}}> 
          <BotaoNovo titulo='Adicionar Conquista'
          eventoPress={() => {
            if (jogo) {
              navigation.navigate('ConquistasCadastro', { jogo: jogo });
            }
          }}/>
        </View>
      );
    }
  }

  /* Monta o cartão do jogo */
  function montaCartaoJogo() {
    return (
      <CartaoJogo key={jogo.id} item={jogo}/>
    );
  }

  useEffect(() => { 
    carregarConquistas();  
  }, [route.params?.atualizaConquista, jogo.totalConcluidas]); 

  /* Este é um monitor para o navigation */
  useEffect(() => {
    navigation.setOptions({
      title: 'Conquistas',
      headerTitleStyle: {
        fontSize: 24, 
        fontWeight: 'bold',
      },
      headerBackTitle: 'Voltar',
      headerRight: () => (
        <BotaoIcone icone={Constantes.IconeNovo} tamanho={36} eventoPress={() => {
            navigation.navigate('ConquistasCadastro', { jogo: jogo }); 
        }} />
      ), 
    });
  }, [navigation]); 

  return (
    <View style={{flex: 1}}>
      <View>
        {montaCartaoJogo()}  
      </View>
      {abreVazio()}  
      <View>
        <FlatList
          data={listaConquistas}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <ItemLista  key={item.id} 
                        item={item} 
                        eventoPressCk={() => {
                          item.concluida = !item.concluida;
                          setarConcluida(item);
                        }}
                        eventoPress={() => {
                          navigation.navigate('ConquistasCadastro', { jogo: jogo, conquista: item });
                        }}
                        eventoLongPress={() => {
                          prepararExclusaoConquista(item);
                        }}
                      />
          )}
        />
      </View>

    </View>   
  )
}