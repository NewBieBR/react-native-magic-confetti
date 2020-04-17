## React Native Magic Confetti

Beautiful and butter smooth confetti animation for React Native.

<img src="https://github.com/NewBieBR/react-native-magic-confetti/blob/master/assets/demo1.gif?raw=true" style="height:500px">
<img style="margin-left:30px; height:500px" src="https://github.com/NewBieBR/react-native-magic-confetti/blob/master/assets/demo2.gif?raw=true">

### Installation

- Intall [react-native-reanimated](https://github.com/software-mansion/react-native-reanimated)
- Install this package
  ```bash
  yarn add react-native-magic-confetti
  # OR
  npm add --save react-native-magic-confetti
  ```

### Basic Usage
```jsx
import Confetti from 'react-native-magic-confetti';

<Confetti confettiImages={[require('./confetti.png')]}>
```

### Advanced Usage

```jsx
import Confetti from 'react-native-magic-confetti';
import FastImage from 'react-native-fast-image';

<Confetti
  count={42} // custom number of confettis
  size={32}
  colors={['red', 'green', 'blue']} // require FastImage
  imageComponent={FastImage} // custom image component
  confettiImages={[
    require('./assets/star.png'),
    require('./assets/triangle.png'),
    require('./assets/square.png'),
    require('./assets/circle.png'),
  ]} // all confetti images to be chosen randomly
  yspeed={3} // fall speed
/>
```