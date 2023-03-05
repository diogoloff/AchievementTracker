import { StyleSheet, View, Text } from 'react-native';
import { FAB } from 'react-native-paper';

export default function BotaoNovo({ titulo, eventoPress }) {
  return (
      <View style={[styles.containerfab]}>
        <Text style={{padding: 10, fontSize: 24, fontWeight: 'bold'}}>{titulo}</Text>
        <FAB style={styles.fab} icon="plus" customSize={200} color='#fff' onPress={eventoPress}/>
      </View>
  );  
}

const styles = StyleSheet.create({
  containerfab: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    height: 150,
    width: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'green',
  },
});