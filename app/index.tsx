import { Redirect } from "expo-router";
import React, { useEffect } from "react";
import * as SecureStore from 'expo-secure-store';

export default function Index() {

  const [element, setElement] = React.useState<JSX.Element | null>(null);

  useEffect(() => {
    (async () => {
      const token = await SecureStore.getItemAsync('token');
      
      if (element == null) {
        if (token) {
          setElement(<Redirect href='/home' />);

        } else {
          setElement(<Redirect href='/login' />);
        }
      }
    })();
  }, [element]);

  return element;
}

