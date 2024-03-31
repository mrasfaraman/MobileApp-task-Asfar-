import React from 'react';
import styled from 'styled-components/native';

const SearchContainer = styled.View<{$width: string}>`
   flex-direction: row;
   align-items: center;
   background-color: #f2f2f2;
   border-radius: 4px;
   width: ${props => props.$width};
   height: 50px;
   border-width: 1px;
`;

const SearchInput = styled.TextInput`
   flex: 1;
   font-size: 16px;
   color: black;
   background-color: white;
   border-radius: 4px;
`;

const IconView = styled.View`
   width: 48px;
   height: 48px;
   background-color: #49b0ab;
   align-items: center;
   justify-content: center;
   border-top-right-radius: 3px;
   border-bottom-right-radius: 3px;
`;

const SearchIcon = styled.Image`
   width: 20px;
   height: 20px;
`;

interface SearchBarProps {
   placeholder: string;
   value: string;
   onChangeText: (text: string) => void;
   width: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
   placeholder,
   value,
   onChangeText,
   width,
}) => {
   return (
      <SearchContainer $width={width}>
         <SearchInput
            placeholder={placeholder}
            value={value}
            onChangeText={onChangeText}
            placeholderTextColor="#888888"
         />
         <IconView>
            <SearchIcon
               source={require('../assets/search.png')}
               resizeMode="contain"
            />
         </IconView>
      </SearchContainer>
   );
};

export default SearchBar;
