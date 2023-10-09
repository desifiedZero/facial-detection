import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

interface InputProps {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  placeHolder: string;
  iconName: React.ComponentProps<typeof FontAwesome>['name'];
  iconSize: number;
  isPassword?: boolean;
  autoComplete?:
    | 'additional-name'
    | 'address-line1'
    | 'address-line2'
    | 'birthdate-day'
    | 'birthdate-full'
    | 'birthdate-month'
    | 'birthdate-year'
    | 'cc-csc'
    | 'cc-exp'
    | 'cc-exp-day'
    | 'cc-exp-month'
    | 'cc-exp-year'
    | 'cc-number'
    | 'country'
    | 'current-password'
    | 'email'
    | 'family-name'
    | 'gender'
    | 'given-name'
    | 'honorific-prefix'
    | 'honorific-suffix'
    | 'name'
    | 'name-family'
    | 'name-given'
    | 'name-middle'
    | 'name-middle-initial'
    | 'name-prefix'
    | 'name-suffix'
    | 'new-password'
    | 'nickname'
    | 'one-time-code'
    | 'organization'
    | 'organization-title'
    | 'password'
    | 'password-new'
    | 'postal-address'
    | 'postal-address-country'
    | 'postal-address-extended'
    | 'postal-address-extended-postal-code'
    | 'postal-address-locality'
    | 'postal-address-region'
    | 'postal-code'
    | 'street-address'
    | 'sms-otp'
    | 'tel'
    | 'tel-country-code'
    | 'tel-national'
    | 'tel-device'
    | 'url'
    | 'username'
    | 'username-new'
    | 'off'
    | undefined;
}

export default function InputField({ value, setValue, placeHolder, iconName, iconSize, isPassword, autoComplete }: InputProps) {
    return (<View style={styles.input}>
        <FontAwesome name={iconName} size={iconSize} color="#494949" />
        <View style={{
          borderColor: '#CBCBCB',
          borderLeftWidth: 1,
          height: 50,
        }} />
        <View style={{flexGrow: 1}}>
          <TextInput 
            value={value} 
            onChangeText={setValue} 
            placeholder={placeHolder} 
            editable 
            style={{ 
                color: "#494949", 
                fontSize: 20, 
                fontWeight: "800",
                paddingVertical: 5
            }}
            secureTextEntry={isPassword}
            autoComplete={autoComplete}
          />
        </View>
      </View>);
}

const styles = StyleSheet.create({
  input: {
    borderColor: '#CBCBCB',
    borderRadius: 20,
    borderWidth: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    columnGap: 20,
    overflow: 'hidden',
  },
});

InputField.defaultProps = {
    isPassword: false,
}
