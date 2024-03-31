import React, {useState} from 'react';
import styled from 'styled-components/native';
import Switch from '../components/Switch';

const HeaderContainer = styled.View`
   background-color: #fdfcff;
   elevation: 2;
`;

const TopHeader = styled.View`
   height: 70px;
   flex-direction: row;
   justify-content: space-between;
   align-items: center;
   padding: 0 15px;
   background-color: #182545;
`;

const Title = styled.Text`
   font-size: 20px;
   font-family: Rubik-Regular;
   color: white;
   top: 2px;
`;

const ImageWrapper = styled.Image`
   width: 40px;
   height: 40px;
`;

const CardContainer = styled.View`
   background-color: #fdfcff;
   width: 100%;
   flex-direction: row;
   justify-content: space-between;
   padding-horizontal: 15px;
   padding-vertical: 10px;
   margin-top: 5px;
`;

const CardView = styled.View`
   background-color: #fdfcff;
   width: 48.5%;
`;

const Card = styled.View<{$color?: string}>`
   padding: 10px;
   background-color: ${props => props.$color || 'white'};
   width: 100%;
   border-radius: 10px;
`;

const BaseText = styled.Text`
   font-size: 15px;
   margin-bottom: 3px;
   color: black;
   font-family: Rubik-Medium;
   text-align: center;
`;

const CardText = styled.Text<{$color: string}>`
   font-size: 14px;
   font-family: Rubik-Regular;
   color: ${props => props.$color || 'black'};
`;

const RowView = styled.View`
   flex-direction: row;
   width: 100%;
   justify-content: space-between;
`;

const Icon = styled.Image<{$width: string; $height: string; $top: string}>`
   width: ${props => props.$width};
   height: ${props => props.$height};
   top: ${props => props.$top};
`;

const LeftView = styled.View`
   flex: 1;
`;

const RightView = styled.View`
   height: 52px;
`;

const ArrowIcon = styled.Image<{$color: string}>`
   width: 16px;
   height: 16px;
   tint-color: ${props => props.$color};
   left: 3px;
   align-self: center;
`;

const Header: React.FC = () => {
   const [switchToggle1, setSwitchToggle1] = useState(false);
   const [switchToggle2, setSwitchToggle2] = useState(false);

   return (
      <HeaderContainer>
         <TopHeader>
            <ImageWrapper
               resizeMode="contain"
               source={require('../assets/home.png')}
            />
            <Title>Routines</Title>
            <ImageWrapper
               resizeMode="contain"
               source={require('../assets/setting.png')}
            />
         </TopHeader>

         <CardContainer>
            <CardView>
               <BaseText>Morning Routine</BaseText>
               <Card $color={'#CFE4FF'}>
                  <RowView>
                     <LeftView>
                        <CardText $color="black">Weekdays</CardText>
                        <CardText $color="black">7:00 AM</CardText>
                     </LeftView>
                     <RightView>
                        <Icon
                           $width="55px"
                           $height="55px"
                           $top="-3px"
                           resizeMode="contain"
                           source={require('../assets/cloudy.png')}
                        />
                     </RightView>
                  </RowView>

                  <RowView>
                     <Switch
                        toggled={switchToggle1}
                        onChange={setSwitchToggle1}
                     />
                     <ArrowIcon
                        $color="black"
                        resizeMode="contain"
                        source={require('../assets/right_arrow.png')}
                     />
                  </RowView>
               </Card>
            </CardView>

            <CardView>
               <BaseText>Night Routine</BaseText>
               <Card $color={'#103C58'}>
                  <RowView>
                     <LeftView>
                        <CardText $color={'white'}>Everyday</CardText>
                        <CardText $color={'white'}>9:00 PM</CardText>
                     </LeftView>
                     <RightView>
                        <Icon
                           $width="35px"
                           $height="40px"
                           $top="0px"
                           resizeMode="contain"
                           source={require('../assets/moon.png')}
                        />
                     </RightView>
                  </RowView>
                  <RowView>
                     <Switch
                        toggled={switchToggle2}
                        onChange={setSwitchToggle2}
                     />
                     <ArrowIcon
                        $color="white"
                        resizeMode="contain"
                        source={require('../assets/right_arrow.png')}
                     />
                  </RowView>
               </Card>
            </CardView>
         </CardContainer>
      </HeaderContainer>
   );
};

export default Header;
