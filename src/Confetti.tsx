import * as React from 'react';
import { Dimensions, Image, ImageSourcePropType, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

export interface ConfettiProps {
  absoluteFill: boolean;
  colors: string[]; // Require react-native-fast-image to work
  size: number;
  count: number;
  imageComponent?: React.ComponentClass<any, any>;
  confettiImages: ImageSourcePropType[];
  yspeed: number;
}

interface ConfettiInfo {
  key: number;
  x: Animated.Value<number>;
  y: Animated.Value<number>;
  angle: Animated.Value<number>;
  xVel: Animated.Value<number>;
  yVel: Animated.Value<number>;
  angleVel: Animated.Value<number>;
  color: string;
  elasticity: number;
  delay: Animated.Value<number>;
  clock: any;
  image: ImageSourcePropType;
}

export default class Confetti extends React.Component<ConfettiProps, any> {
  static defaultProps = {
    absoluteFill: true,
    colors: ['blueviolet', 'indianred', 'lightseagreen'],
    size: 18,
    count: 64,
    yspeed: 1,
  };

  confettiStyle: { width: number; height: number };

  confettis: ConfettiInfo[];

  constructor(props: ConfettiProps) {
    super(props);
    this.state = {};
    this.confettiStyle = { width: props.size, height: props.size };
    this.confettis = this.createConfettis();
  }

  public render() {
    const { absoluteFill, imageComponent, size } = this.props;
    const style: any = [styles.container];
    if (absoluteFill) style.push(StyleSheet.absoluteFill);
    const ImageComponent = imageComponent || Image;
    return (
      <View style={style}>
        {this.confettis.map(
          ({ key, x, y, angle, xVel, yVel, angleVel, color, elasticity, delay, clock, image }) => {
            return (
              <React.Fragment key={key}>
                <Animated.Code>
                  {() => {
                    const {
                      startClock,
                      set,
                      add,
                      sub,
                      divide,
                      diff,
                      multiply,
                      cond,
                      clockRunning,
                      greaterThan,
                      lessThan,
                    } = Animated;
                    const { width: screenWidth } = Dimensions.get('window');

                    const timeDiff = diff(clock);
                    const dt = divide(timeDiff, 1000);
                    const dy = multiply(dt, yVel);
                    const dx = multiply(dt, xVel);
                    const dAngle = multiply(dt, angleVel);

                    return cond(
                      clockRunning(clock),
                      [
                        cond(
                          greaterThan(delay, 0),
                          [set(delay, sub(delay, dt))],
                          [set(y, add(y, dy)), set(x, add(x, dx)), set(angle, add(angle, dAngle))],
                        ),
                        cond(greaterThan(x, screenWidth - size), [
                          set(x, screenWidth - size),
                          set(xVel, multiply(xVel, -elasticity)),
                        ]),
                        cond(lessThan(x, 0), [set(x, 0), set(xVel, multiply(xVel, -elasticity))]),
                      ],
                      [startClock(clock), timeDiff],
                    );
                  }}
                </Animated.Code>
                <Animated.View
                  style={[
                    styles.confettiContainer,
                    {
                      transform: [
                        { translateX: x },
                        { translateY: y },
                        { rotate: angle },
                        { rotateX: angle },
                        { rotateY: angle },
                      ],
                    },
                  ]}
                >
                  <ImageComponent tintColor={color} source={image} style={this.confettiStyle} />
                </Animated.View>
              </React.Fragment>
            );
          },
        )}
      </View>
    );
  }

  private createConfettis() {
    const { colors, size, count, confettiImages, yspeed } = this.props;
    const { width: screenWidth } = Dimensions.get('screen');

    return [...new Array(count)].map((_, i) => {
      const clock = new Animated.Clock();

      return {
        key: i,
        // Spawn confetti from two different sources, a quarter
        // from the left and a quarter from the right edge of the screen.
        x: new Animated.Value(screenWidth * (i % 2 ? 0.25 : 0.75) - size / 2),
        y: new Animated.Value(-60),
        angle: new Animated.Value(0),
        xVel: new Animated.Value(Math.random() * 400 - 200),
        yVel: new Animated.Value(Math.random() * 150 * yspeed + 150 * yspeed),
        angleVel: new Animated.Value((Math.random() * 3 - 1.5) * Math.PI),
        delay: new Animated.Value(Math.floor(i / 10) * 0.3),
        elasticity: Math.random() * 0.3 + 0.1,
        color: colors[i % colors.length],
        clock,
        image: confettiImages[i % confettiImages.length],
      };
    });
  }
}

const styles = StyleSheet.create({
  container: {},
  confettiContainer: { position: 'absolute', top: 0, left: 0 },
});
