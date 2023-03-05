import { useEffect, useState, useCallback, useContext } from 'react';
import { View, FlatList, Alert, TouchableWithoutFeedback, Keyboard, InteractionManager } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';

import { executeSql } from "../db";

import * as Constantes from '../Constantes';
import Globais from '../Globais';
import BotaoIcone from '../components/BotaoIcone';
import BotaoNovo from '../components/BotaoNovo';
import CartaoJogo from '../components/CartaoJogo';

export default function Jogos({ navigation }) {

  /* Armazena o Jogo atual para controles de edição */
  const { jogo, setJogo } = useContext(Globais);
  
   /* Armazena o Jogo atual para controles de edicao */
  //const [jogo, setJogo] = useState(null);

  /* Lista dos jogos  */
  const [listaJogos, setListaJogos] = useState([]);

  /* Controla se o formulario de cadastro é visivel  */
  const [formularioVisivel, setFormularioVisivel] = useState(false); 

  /* Controla o campo de busca */
  const [busca, setBusca] = useState(""); 

  /* Carrega a lista de jogos para a tela */
  async function carregarJogos() {

    let filtro = "";
    if (busca.trim() !== "") {
      filtro = "WHERE j.nome LIKE '" + busca.trim() + "%'"
    }

    const rs = await executeSql(`SELECT j.id, j.nome, j.imagem,
                                 (SELECT count(c.id) from conquistas c WHERE c.idjogo = j.id) totalConquistas, 
                                 (SELECT count(c.id) from conquistas c WHERE c.idjogo = j.id and c.concluida = 1) totalConcluidas 
                                 FROM jogos j ` + filtro + ` ORDER BY j.id`);                          
    setListaJogos(rs.rows._array);
  }

  /* Fecha o formulario e recarrega as informações */
  function recarregarTela(){
    setFormularioVisivel(false);
    carregarJogos();
  }

  /* Função que adiciona um jogo no banco de dados */
  async function adicionarJogo(item) {
    try {
      const rs = await executeSql("INSERT INTO jogos (nome, imagem) VALUES(?, ?)", [item.nome, item.imagem]);
      recarregarTela();
    } catch (err) {
      console.error(err);
    }    
  }

  /* Função que edita um jogo no banco de dados */
  async function editarJogo(item) {
    try {
      const rs = await executeSql("UPDATE jogos SET nome = ?, imagem = ? WHERE id = ?", [item.nome, item.imagem, item.id]);
      recarregarTela();
    } catch (err) {
      console.error(err);
    }    
  }

  /* Função que deleta um jogo no banco de dados */
  async function excluirJogo(item) {
    try {
      await executeSql("DELETE FROM objetivos WHERE objetivos.idconquista in (SELECT c.id FROM conquistas c WHERE c.idjogo = ? and c.id = objetivos.idconquista)", [item.id]);
      await executeSql("DELETE FROM conquistas WHERE idjogo = ?", [item.id]);
      await executeSql("DELETE FROM jogos WHERE id = ?", [item.id]);
      recarregarTela();
    } catch (err) {
      console.error(err);
    }    
  }

  /* Função que verifica se um jogo em conquistas relacionadas */
  async function existemConquistas(item) {
    try {
      const rs = await executeSql("SELECT id FROM conquistas WHERE idjogo = ?", [item.id]);
      if (rs.rows._array.length > 0) {
        Alert.alert(
          "Atenção",
          "Existem conquistas atreladas a este jogo, excluir mesmo assim?",
          [{text: "Cancelar", style: "cancel"},
           {text: "OK", onPress: () => excluirJogo(item)}], 
          { cancelable: false }
        );   
      }
      else {
        excluirJogo(item);  
      }
    } catch (err) {
      console.error(err);
    }  
  } 

  /* Função que escolhe se edita ou exclui o jogo */
  function alterarJogo(item, excluir) {
    if (excluir) {
      Alert.alert(
        "Remover Jogo\n" + item.nome,
        "Você confirma a exclusão deste jogo?",
        [{text: "Cancelar", style: "cancel"},
         {text: "OK", onPress: () => existemConquistas(item)}], //
        { cancelable: false }
      );      
    } else {
      editarJogo(item);
    } 
  }
  
  /* Se a tela estiver vazia monta um botão grande de adicionar */
  function abreVazio() {
    if ((listaJogos.length === 0) && (!formularioVisivel)) {
      return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{flex: 1}}> 
            <BotaoNovo titulo='Adicionar Jogo' 
            eventoPress={() => {
              setJogo(null);
              setFormularioVisivel(!formularioVisivel);
            }}/>
          </View>
        </TouchableWithoutFeedback>
      );
    }
  }

  /* função que abre o formulario de cadastro ou alteração */
  function abreFormulario() {
    if (formularioVisivel) {
      return (
        <CartaoJogo tipoTela='cadastro' item={jogo} eventoPress={jogo ? alterarJogo : adicionarJogo} />
      )
    }
  }

  /* função que monta uma barra de busca */
  function montaPesquisa() {
    if (!formularioVisivel) {
      return (
        <Searchbar
          style={{backgroundColor: Constantes.CorFormulario}}
          selectionColor={Constantes.CorTextoSelecionado}
          autoCorrect={false}
          placeholder="Pesquisar Jogo"
          onChangeText={texto => setBusca(texto)}
          onIconPress={() => carregarJogos()}
          onSubmitEditing={() => carregarJogos()}
          value={busca}
          iconColor={Constantes.CorPadrao}
          
        />  
      )
    }
  } 

  /* Excuta no retorno da tela anterior pelo foco*/
  /* useFocusEffect(
    useCallback(
        carregarJogos();  
    }, [jogo.totalConcluidas, jogo.totalConquistas])
  );*/

  /* Atualiza sempre que os valores de alguma destas variaveis modificar */
  /* busca, jogo.totalConcluidas, jogo.totalConquistas */
  useEffect(() => { 
    carregarJogos();
  }, [busca, jogo?.totalConcluidas, jogo?.totalConquistas]);
  
  /* Este é um monitor para o navigation e 
  também para setar o formualario de cadastro visivel*/
  useEffect(() => {
    navigation.setOptions({
      title: 'Jogos',
      headerTitleStyle: {
        fontSize: 24, 
        fontWeight: 'bold',
      },
      headerRight: () => (
        <BotaoIcone icone={Constantes.IconeNovo} tamanho={36} eventoPress={() => {
          setJogo(null);
          setFormularioVisivel(!formularioVisivel);
        }} />
      ),
    });
  }, [navigation, formularioVisivel]);

  return (
    <View style={{flex: 1}}>
      <View>
        {montaPesquisa()}
        {abreFormulario()}
      </View>
      {abreVazio()}  
      <View>
        <FlatList
          data={listaJogos}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <CartaoJogo key={item.id} 
                        item={item} 
                        eventoPress={() => {
                          setFormularioVisivel(false);
                          setJogo(item);
                          navigation.navigate('Conquistas');
                        }}
                        eventoLongPress={() => {
                          setJogo(item);
                          setFormularioVisivel(!formularioVisivel);
                        }}/>
          )}
        />
      </View>
    </View>
  )
}

