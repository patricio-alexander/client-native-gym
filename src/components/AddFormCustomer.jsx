import { Formik } from "formik";
import { View, ScrollView, Platform } from "react-native";
import { planDuration } from "../helpers/date.js";
import { useCustomer } from "../context/CustomerProvider";
import FormikInputValue from "./FormikInputValue";
import { Button, Avatar, FAB, Text, IconButton } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { useTheme, HelperText } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useEffect, useState } from "react";
import { savePhotoCustomerRequest } from "../api/clients_api.js";
import { pathPhotos } from "../api/axios.js";

const AddFormCustomer = ({ route }) => {
  
  const theme = useTheme();
  const customerId = route.params?.customerId;
  const [form, setForm] = useState({
    dni: "",
    names: "",
    lastnames: "",
    phone: "",
    amount: "",
  });
  const {
    currentPrice,
    getCurrentPrice,
    addCustomer,
    getOneCustomer,
    updateCustomerData,
  } = useCustomer();

  const [file, setFile] = useState("");

  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  const onSubmit = async (values) => {
    const { durationInDays, formattedDateInitial, formattedDateFinal } =
      planDuration({
        initialDate: date,
        price: values.amount,
        currentPrice,
      });

    if (customerId) {
      updateCustomerData(
        {
          ...values,
          startDate: formattedDateInitial,
          endingDate: formattedDateFinal,
          duration: durationInDays,
        },
        customerId
      );
      // console.log(customerId);

      return;
    }

    addCustomer({
      ...values,
      startDate: formattedDateInitial,
      endingDate: formattedDateFinal,
      duration: durationInDays,
      photo: file,
    });
  };

  const toggleDatePicker = () => {
    console.log("pickertogle");
    setOpen(!open);
  };

  const onChange = ({ type }, selectDate) => {
    console.log("on change");
    const currentDate = selectDate || date;

    if (Platform.OS === "android" && type === "set") {
      setDate(currentDate);
      toggleDatePicker();
    } else {
      toggleDatePicker();
    }
    // console.log(open);
    // // console.log(type);

    // if (type == "set") {
    //   setDate(selectDate);

    //   if (Platform.OS === "android") {
    //     toggleDatePicker();
    //   }
    // } else {
    //   toggleDatePicker();
    // }
  };

  const validate = (values) => {
    const errors = {};
    if (!values.dni) {
      errors.dni = "Cédula requerida";
    } else if (values.dni.length !== 10) {
      errors.dni = "La cédula debe contener 10 dígitos";
    }

    if (values.names.length <= 3) errors.names = "Nombres requeridos";

    if (values.lastnames.length <= 3) errors.lastnames = "Apellidos requeridos";

    if (values.phone.length < 10)
      errors.phone = "El número debe tener 10 dígitos";

    if (!values.amount) errors.amount = "Coloque el monto";

    return errors;
  };

  const savePhoto = async () => {
    try {
      const formData = new FormData();
      formData.append("photo", {
        uri: file,
        type: "image/jpeg", // o el tipo de archivo correspondiente
        name: "image.jpg", // nombre del archivo
      });

      // console.log(formData)
      const photo = await savePhotoCustomerRequest(customerId, formData);
      // // console.log(photo)
    } catch (error) {
      console.log(error.response);
    }
  };

  const pickImage = async () => {
    // if (file) {
    //   savePhoto();
    //   return;
    // }

    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // console.log(result);

    if (!result.canceled) {
      setFile(result.assets[0].uri);
    }
  };

  useEffect(() => {
    getCurrentPrice();
    if (customerId) {
      (async () => {
        const data = await getOneCustomer(customerId);

        setForm(data);
      })();
    }
  }, []);

  const imageUrl = file
    ? file
    : customerId && form?.photo
    ? { uri: `${pathPhotos}/${form.photo}` }
    : require("../../assets/noImage.png");

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      style={{ backgroundColor: theme.colors.background }}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View
        style={{
          // flex: 1,
          // justifyContent: "center",
          // alignItems: "center",
          padding: 20,
        }}
      >
        <Formik
          initialValues={form}
          validate={validate}
          onSubmit={onSubmit}
          enableReinitialize={true}
        >
          {({ handleSubmit, errors, touched, isValid }) => (
            <>
              {open && (
                <DateTimePicker
                
                  mode="date"
                  display="spinner"
                  value={date}
                  onChange={onChange}
                />
              )}

              <View style={{ alignItems: "center", margin: 10 }}>
                <Avatar.Image size={80} source={imageUrl} />

                <Button icon="camera" onPress={pickImage}>
                  {customerId ? "Editar" : "Añadir"} Foto
                </Button>

                {file && customerId && (
                  <FAB
                    icon="send"
                    size={20}
                    onPress={savePhoto}
                    style={{ position: "absolute", top: 0, left: 3 }}
                  />
                )}
              </View>
              <View
                style={{
                  width: "100%",
                  marginBottom: 10,
                  display: "flex",
                  flexDirection: "row", // Alinear los elementos en fila
                  alignItems: "center",
                  alignContent: "center",
                }}
              >
                <Text variant="bodyLarge">
                  Fecha de pago: {date.toLocaleDateString()}
                </Text>
                <IconButton
                  icon="calendar"
                  size={20}
                  mode="outlined"
                  onPress={toggleDatePicker}
                  style={{ marginLeft: "auto" }} // Mueve el IconButton a la derecha
                />
              </View>

              <View style={{ width: "100%", marginBottom: 10 }}>
                <FormikInputValue
                  keyboardType="numeric"
                  label="Cédula"
                  name="dni"
                  maxLength={10}
                />

                {errors.dni && touched.dni ? (
                  <HelperText type="error">{errors.dni}</HelperText>
                ) : null}
              </View>

              <View style={{ width: "100%", marginBottom: 10 }}>
                <FormikInputValue label="Nombres" name="names" />

                {errors.names && touched.names ? (
                  <HelperText type="error">{errors.names}</HelperText>
                ) : null}
              </View>

              <View style={{ width: "100%", marginBottom: 10 }}>
                <FormikInputValue label="Apellidos" name="lastnames" />

                {errors.lastnames && touched.lastnames ? (
                  <HelperText type="error">{errors.lastnames}</HelperText>
                ) : null}
              </View>

              <View style={{ width: "100%", marginBottom: 10 }}>
                <FormikInputValue
                  label="Célular"
                  keyboardType="numeric"
                  name="phone"
                  maxLength={10}
                />
                {errors.phone && touched.phone ? (
                  <HelperText type="error">{errors.phone}</HelperText>
                ) : null}
              </View>

              <View style={{ width: "100%", marginBottom: 10 }}>
                <FormikInputValue
                  label="Monto"
                  keyboardType="numeric"
                  name="amount"
                />
                {errors.amount && touched.amount ? (
                  <HelperText type="error">{errors.amount}</HelperText>
                ) : null}
              </View>
              <View
                style={{
                  width: "100%",
                  marginTop: 10,
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  style={{ marginLeft: 10 }}
                  // textColor={theme.colors.white}
                  // buttonColor={theme.colors.red1}
                  onPress={handleSubmit}
                  disabled={!isValid}
                >
                  Guardar
                </Button>
              </View>
            </>
          )}
        </Formik>
      </View>
    </ScrollView>
  );
};

export default AddFormCustomer;
