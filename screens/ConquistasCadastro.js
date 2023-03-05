import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Platform, PixelRatio } from 'react-native';
import { Button } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Formik } from "formik";
import * as Yup from "yup";

import { executeSql } from "../db";
import KeyboardAvoidingView from "../components/KeyboardAvoidingView";

//import KeyboardAvoidingView from "../components/KeyboardAvoidingView";
import CartaoJogo from '../components/CartaoJogo';
import CaixaTexto from '../components/CaixaTexto';
import { CorPadrao } from '../Constantes';

const ConquistaSchema = Yup.object().shape({
  nome: Yup.string().required("Nome da Conquista é obrigatória").min(3, "Nome da Conquista deve ter no mínimo de 3 letras"),
  //descricao: Yup.string().required("Descrição da Conquista é obrigatória").min(15, "Descrição deve ter no mínimo de 15 letras"),
});

/* Retonar o tamanho da barra em baixo da tela */
function retornaTamanhoBarraInferior() {
  const { bottom } = useSafeAreaInsets(); // Retorna o espaço reservado na parte de baixo do dispositivo
  const TAMANHO_BARRA = 80;

  return TAMANHO_BARRA + bottom;
}

export default function ConquistasCadastro({ route, navigation }) {

  const [tamanhoMemo, setTamanhoMemo] = useState(0);

  /* Função que adiciona uma conquista no banco de dados */
  async function adicionarConquista(item) {
    try {
      const rs = await executeSql("INSERT INTO conquistas (idjogo, nome, descricao, concluida) VALUES(?, ?, ?, 0)", [item.idjogo, item.nome, item.descricao]);
      navigation.navigate('Conquistas', { atualizaConquista: rs.insertId });
    } catch (err) {
      console.error(err);
    }    
  }

  /* Função que edita uma conquista no banco de dados */
  async function editarConquista(item) {
    try {
      const rs = await executeSql("UPDATE conquistas SET nome = ?, descricao = ? where id = ?", [item.nome, item.descricao, item.idconquista]);
      navigation.navigate('Conquistas', { atualizaConquista: item });
    } catch (err) {
      console.error(err);
    }    
  }

  /* Monta o card no cabeçalho com o Jogo que foi selecionado */
  function montaCartaoJogo() {
    return (
      <CartaoJogo key={route.params.jogo.id} item={route.params.jogo} /> 
    );
  }

  /* Este é um monitor para o navigation */
  useEffect(() => {
    navigation.setOptions({
      title: 'Conquistas',
      headerTitleStyle: {
        fontSize: 24, 
        fontWeight: 'bold',
      },
      headerBackTitle: 'Voltar',
    });
  }, [navigation]); 

  return (
    <View style={{ flex: 1 }}>
    <KeyboardAvoidingView>
      <Formik
        initialValues={{
          idjogo: route.params.jogo.id,
          idconquista: route.params?.conquista ? route.params?.conquista.id : 0,
          nome: route.params?.conquista ? route.params?.conquista.nome : "",
          descricao: route.params?.conquista ? route.params.conquista.descricao : "",
        }}
        validationSchema={ConquistaSchema}
        onSubmit={async (values, actions) => {
          try {
            // Aqui deveria ter tratamento se for uma edição
            if (values.idconquista > 0) {
              editarConquista(values);
            } else {
              adicionarConquista(values);
            }            
          } catch (err) {
            console.error(err);
          }
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, touched, errors, values }) => {
          return (
            <View >
              <View>
                {montaCartaoJogo()}   
              </View>
              <View style={styles.containerformulario}>
                <Text style={styles.titulo}>Adicionar Conquistas</Text>
                <CaixaTexto
                  autoCorrect={false}
                  label="Conquista"
                  onChangeText={handleChange("nome")}
                  onBlur={handleBlur("nome")}
                  value={values.nome}
                  erro={touched.nome && errors.nome}
                  maxLength={30}
                />
               
                <CaixaTexto
                  autoCorrect={false}
                  label="Descrição"
                  onChangeText={handleChange("descricao")}
                  onBlur={handleBlur("descricao")}
                  value={values.descricao}
                  erro={touched.descricao && errors.descricao}
                  multiline={true}
                  numberOfLines={Platform.OS === 'ios' ? null : 5}
                  minHeight={Platform.OS === 'ios' ? tamanhoMemo : null}
                  maxLength={255}
                  
                  onContentSizeChange={({ nativeEvent: { contentSize: { width: txtWidth, height: txtHeight } } }) => {
                    if (tamanhoMemo === 0) {
                      setTamanhoMemo((txtHeight * PixelRatio.get()) * 5)
                    }
                  }}
                /> 
              
                <Button  onPress={handleSubmit} mode="contained" style={{ alignSelf: 'center', marginTop: 12}} buttonColor={CorPadrao}>Gravar</Button>
              </View> 
                
          </View>
          );
        }}
      </Formik>
    </KeyboardAvoidingView>
      
    </View>
  )

  //
}

const styles = StyleSheet.create({
  containerformulario: {
    padding: 10,
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
  barrarinferior: {
    elevation: 3,
    backgroundColor: '#fff',
    shadowOffset: { width: 1, height: 1},
    shadowColor: '#333',
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 6,
    marginBottom: 18,
    textAlign: 'center',
  },
});