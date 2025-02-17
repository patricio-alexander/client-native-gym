import { useField } from "formik";
import { TextInput } from "react-native-paper";

const FormikInputValue = ({ name, ...props }) => {
  const [field, meta, helpers] = useField(name);

  return (
    <TextInput
      value={String(field.value)}
      onChangeText={(value) => helpers.setValue(value)}
      onFocus={() => helpers.setTouched(true)}
      {...props}
    />
  );
};

export default FormikInputValue;
