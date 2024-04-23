import { useEffect, useState } from "react";
import { Image, View } from "react-native";
import { TextInput, Button, Text, Avatar } from "react-native-paper";
import { Formik } from "formik";
import FormikInputValue from "../components/FormikInputValue";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "react-native-paper";

const initialValues = { username: "", password: "" };

const Login = () => {
  const theme = useTheme();
  const { signin, errors } = useAuth();

  const onSubmit = (values) => {
    signin(values);
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.background,
        padding: 20,
      }}
    >
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {({ handleSubmit, isSubmitting }) => {
          return (
            <>
              <Avatar.Image
                style={{ backgroundColor: theme.colors.background }}
                source={require("../../assets/gymLogo.png")}
                size={200}
              />
              {errors.message && (
                <Text
                  variant="titleSmall"
                  style={{ marginBottom: 10, color: theme.colors.error }}
                >
                  {errors.message}
                </Text>
              )}

              <View style={{ width: "100%", marginBottom: 10 }}>
                <FormikInputValue label="Username" name="username" />
              </View>
              <View style={{ width: "100%", marginBottom: 10 }}>
                <FormikInputValue
                  label="Password"
                  name="password"
                  secureTextEntry
                />
              </View>

              <Button style={{ marginTop: 10 }} onPress={handleSubmit}>
                Iniciar sesión
              </Button>
            </>
          );
        }}
      </Formik>
    </View>
  );
};

export default Login;
