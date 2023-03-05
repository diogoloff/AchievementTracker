import { KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform, ScrollView, View } from "react-native";

// esse é um componente usado para certos controle automáticos de teclado
// em telas que vão ter formulários, é montado com um conjunto de técnicas
// usa o componente `KeyboardAvoidingView` como base do próprio RN e depois
// anexo mais uma coisas a funcionalidade, como ter ou não barra de rolagem
// em determinado local
export default function CustomKeyboardAvoidingView({
  children,
  style,
  containerProps,
  scrollEnabled = true,
  ...props
}) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : null}
      style={!!style ? style : { flex: 1 }}
      keyboardVerticalOffset={120}
      {...props}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        {!!scrollEnabled ? (
          <ScrollView {...containerProps}>{children}</ScrollView>
        ) : (
          <View {...containerProps}>{children}</View>
        )}
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
