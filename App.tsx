import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  useColorScheme,
  Text,
  TextInput,
} from 'react-native';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

var DashboardModal = require('./app/modals/DashboardModal.js');

//Ignore font scaling from device
  Text.defaultProps = { allowFontScaling: false };
  TextInput.defaultProps = { underlineColorAndroid: 'transparent',
                             placeholderTextColor: '#e1e1e1'
                           }

function App(): React.JSX.Element {
  global.ColorScheme = useColorScheme();
  return (
    <DashboardModal ModelID={'RU7TWX93'} />
  );
}

export default App;
