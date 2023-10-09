/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  useColorScheme,

} from 'react-native';
import { MainScreen } from './src/screen/main/MainScreen';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { ImageFullScreen } from './src/component/ImgFullScreen';
import { ICard } from './src/utils';

interface ImageProps {
  show: (uri: string, listCard: ICard[], callback: () => void) => void
  hide: () => void
}

declare global {
  interface Window {
    image: ImageProps
  }
}

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <MainScreen />
      {/* <YOLOv5Example /> */}
      <ImageFullScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

});

export default App;
