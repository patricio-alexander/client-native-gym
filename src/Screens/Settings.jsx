import { useState } from "react";
import { View } from "react-native";
import {
  Button,
  Portal,
  Modal,
  Text,
  useTheme,
  HelperText,
} from "react-native-paper";
import { Alert } from "react-native";

import { useCustomer } from "../context/CustomerProvider";

import FormikInputValue from "../components/FormikInputValue";
import { Formik } from "formik";
import { changePriceRequest } from "../api/clients_api";

const Settings = () => {
  const { currentPrice, getCurrentPrice } = useCustomer();
  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState({
    price: "",
  });

  const validate = (values) => {
    const errors = {};
    if (!values.price) errors.price = "Valor requerido";

    return errors;
  };
  const theme = useTheme();
  const showModal = () => setVisible(true);

  const onSubmit = async (value) => {
    try {
      const update = await changePriceRequest(value);
      getCurrentPrice();
      Alert.alert(
        "Precio",
        "Precio cambiado con éxito",
        [
          {
            text: "Aceptar",
            onPress: () => console.log("Aceptado precio"),
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.log(error);
    }
  };
  const hideModal = () => setVisible(false);

  const containerStyle = {
    backgroundColor: theme.colors.background,
    borderRadius: 10,
    padding: 20,
    margin: 10,
  };
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={containerStyle}
        >
          <Formik initialValues={form} onSubmit={onSubmit} validate={validate}>
            {({ handleSubmit, isValid, errors, touched }) => (
              <>
                <Text variant="titleMedium" style={{ marginBottom: 10 }}>
                  Precio actual: {currentPrice}$
                </Text>
                <FormikInputValue
                  label="Nuevo precio"
                  name="price"
                  keyboardType="numeric"
                  maxLength={10}
                />
                {errors.price && touched.price ? (
                  <HelperText type="error">{errors.price}</HelperText>
                ) : null}
                <Button
                  onPress={handleSubmit}
                  disabled={!isValid}
                  style={{ marginTop: 10 }}
                >
                  Guardar
                </Button>
              </>
            )}
          </Formik>
        </Modal>
      </Portal>
      <Button icon="cash-multiple" onPress={showModal}>
        Cambiar precio
      </Button>
    </View>
  );
};

export default Settings;
