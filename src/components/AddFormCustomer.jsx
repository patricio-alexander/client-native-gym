import { Formik } from "formik";
import { View, ScrollView, Platform, Alert } from "react-native";
import { planDuration } from "../helpers/date.js";
import { useCustomer } from "../context/CustomerProvider";
import FormikInputValue from "./FormikInputValue";
import {
  Button,
  Avatar,
  Text,
  IconButton,
  useTheme,
  HelperText,
  Portal,
  Dialog,
} from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useEffect, useState } from "react";
import { api, jwt, pathPhotos } from "../api/axios.js";
import { uploadAsync, FileSystemUploadType } from "expo-file-system";

const AddFormCustomer = ({ route }) => {
  const theme = useTheme();
  const customerId = route.params?.customerId;
  const [file, setFile] = useState("");
  const [uploading, setUploading] = useState(false);
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [success, setSucces] = useState(false);
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
    fetchCustomers,
    updateCustomerData,
  } = useCustomer();

  const onSubmit = async (values) => {
    try {
      setUploading(true);
      const { durationInDays, formattedDateInitial, formattedDateFinal } =
        planDuration({
          initialDate: date,
          price: values.amount,
          currentPrice,
        });

      if (customerId) {
        const { success } = await updateCustomerData(
          {
            ...values,
            startDate: formattedDateInitial,
            endingDate: formattedDateFinal,
            duration: durationInDays,
          },
          customerId
        );

        if (success) {
          setUploading(false);
        }

        return;
      }

      const commonValues = {
        ...values,
        startDate: formattedDateInitial,
        endingDate: formattedDateFinal,
        duration: durationInDays,
      };

      if (file) {
        const { success } = await addCustomer({
          ...commonValues,
          photo: file,
        });

        if (success) {
          setUploading(false);
        }
      } else {
        const { success } = await addCustomer(commonValues);
        if (success) {
          setUploading(false);
        }
      }
    } catch (error) {
      setUploading(false);
    }
  };

  const toggleDatePicker = () => {
    setOpen(!open);
  };

  const onChange = ({ type }, selectDate) => {
    const currentDate = selectDate || date;

    if (Platform.OS === "android" && type === "set") {
      setDate(currentDate);
      toggleDatePicker();
    } else {
      toggleDatePicker();
    }
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

  const savePhoto = async (photo) => {
    try {
      setUploading(true);
      const response = await uploadAsync(
        `${api}/customers/photo/${customerId}`,
        photo,
        {
          httpMethod: "PUT",
          uploadType: FileSystemUploadType.MULTIPART,
          fieldName: "photo",
          headers: {
            Authorization: await jwt(),
          },
        }
      );

      setUploading(false);
      setSucces(true);
      fetchCustomers();
    } catch (error) {
      console.log(error);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.75,
    });

    if (!result.canceled && customerId) {
      setFile(result.assets[0].uri);
      savePhoto(result.assets[0].uri);
      return;
    }

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

  const img = () => {
    if (customerId && form?.photo && !file) {
      return { uri: `${pathPhotos}/${form.photo}` };
    }

    if (!file) {
      return require("../../assets/noImage.png");
    }

    if (file) {
      return { uri: file };
    }
  };

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        setSucces(false);
      }, 5000);
    }
  }, [success]);

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      style={{ backgroundColor: theme.colors.background }}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View
        style={{
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
                <Avatar.Image size={80} source={img()} />

                <Button icon="camera" onPress={pickImage}>
                  {customerId ? "Editar" : "Añadir"} Foto
                </Button>

                {success && (
                  <Text style={{ color: theme.colors.success }}>
                    Foto cambiada con éxito
                  </Text>
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
                  style={{ marginLeft: "auto" }}
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
                  maxLength={2}
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
                  onPress={handleSubmit}
                  disabled={!uploading ? !isValid : uploading}
                  loading={uploading}
                >
                  {uploading ? "Enviando..." : "Guardar"}
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
