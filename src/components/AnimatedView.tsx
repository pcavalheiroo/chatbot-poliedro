import React from "react";
import * as Animatable from "react-native-animatable";

type AnimationProps = {
    children: React.ReactNode;
    animation?: Animatable.Animation;
    delay?: number;
    duration?: number;
    style?: any;
};

export default function AnimatedView({
    children,
    animation = "fadeInUp",
    delay = 0,
    duration = 800,
    style = {},
}: AnimationProps) {
    return (
        <Animatable.View
            animation={animation}
            delay={delay}
            duration={duration}
            useNativeDriver
            style={style}
        >
            {children}
        </Animatable.View>
    );
}