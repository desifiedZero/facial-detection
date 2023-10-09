import { Redirect } from "expo-router";
import React, { useEffect } from "react";
import * as SecureStore from 'expo-secure-store';

export default function Index() {

  const [element, setElement] = React.useState<JSX.Element | null>(null);

  useEffect(() => {
    (async () => {
      const loginStatus = await SecureStore.getItemAsync('loginStatus');
      
      if (element == null) {
        if (loginStatus) {
          setElement(<Redirect href='/home' />);

        } else {
          setElement(<Redirect href='/login' />);
        }
      }
    })();
  }, [element]);

  return element;
}

