import React, {useState} from 'react';
import {TouchableOpacity, Animated} from 'react-native';
import styled from 'styled-components/native';

const SwitchView = styled.View<{toggled: boolean}>`
   justify-content: center;
   width: 45px;
   height: 29px;
   border-radius: 18px;
   background-color: ${props => (props.toggled ? '#72CEBC' : '#72777F')};
`;

const SwitchButton = styled(Animated.View)`
   width: 25px;
   height: 25px;
   border-radius: 45px;
   background-color: white;
   position: absolute;
`;

interface SwitchProps {
   id?: string;
   toggled: boolean;
   onChange: (toggled: boolean) => void;
}

const Switch: React.FC<SwitchProps> = ({id, toggled, onChange}) => {
   const [animation] = useState(new Animated.Value(toggled ? 1 : 0));

   const handleToggle = () => {
      Animated.timing(animation, {
         toValue: toggled ? 0 : 1,
         duration: 150,
         useNativeDriver: false,
      }).start();
      onChange && onChange(!toggled);
   };

   const translateX = animation.interpolate({
      inputRange: [0, 1],
      outputRange: [2, 18],
   });

   return (
      <>
         <TouchableOpacity onPress={handleToggle} activeOpacity={1}>
            <SwitchView toggled={toggled}>
               <SwitchButton
                  style={{
                     transform: [{translateX}],
                  }}
               />
            </SwitchView>
         </TouchableOpacity>
      </>
   );
};

export default Switch;
