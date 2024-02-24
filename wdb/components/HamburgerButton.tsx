import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

type HamburgerButtonProps = {
    onPress: () => void;
    style?: object; 
};

const HamburgerButton: React.FC<HamburgerButtonProps> = ({ onPress, style }) => {
    return (
      <Pressable onPress={onPress} style={style}>
        <FontAwesome5 name="hamburger" size={24} color="black" />
      </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        marginLeft: 15,
    },
});

export default HamburgerButton;
