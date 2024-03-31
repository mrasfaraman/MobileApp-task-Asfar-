import React, {useState, useEffect, useCallback, useRef} from 'react';
import styled from 'styled-components/native';
import Header from './custom/Header';
import SearchBar from './components/SearchBar';
import ListItem from './components/ListItem';
import {
   FlatList,
   ListRenderItem,
   RefreshControl,
   ToastAndroid,
} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {fetchReminders} from './services/api';

const AppContainer = styled.SafeAreaView`
   flex: 1;
   background-color: #fdfcff;
`;

const SearchView = styled.View`
   width: 94%;
   align-self: center;
   justify-content: space-between;
   flex-direction: row;
   margin-top: 10px;
`;

const FilterButton = styled.TouchableOpacity`
   align-items: center;
   justify-content: center;
`;

const FilterIcon = styled.Image`
   width: 40px;
   height: 40px;
`;

const EmptyText = styled.Text`
   font-size: 14px;
   color: grey;
   text-align: center;
   margin-top: 30px;
`;

const SpinnerView = styled.View`
   height: 70px;
   align-self: center;
   justify-content: center;
   align-items: center;
`;

const Spinner = styled.ActivityIndicator`
   margin-vertical: 10px;
   background-color: transparent;
`;

const DeleteButton = styled.TouchableOpacity`
   background-color: #ff0000;
   justify-content: center;
   align-items: center;
   width: 70px;
`;

const DeleteText = styled.Text`
   color: #ffffff;
   font-size: 16px;
`;

const MemoizedListItem = React.memo(ListItem);

const App: React.FC = () => {
   const [searchText, setSearchText] = useState<string>('');
   const [isAscending, setIsAscending] = useState<boolean>(false);
   const [loading, setLoading] = useState<boolean>(true);
   const [pageLoading, setPageLoading] = useState<boolean>(false);
   const [reminders, setReminders] = useState<any[]>([]);
   const [filteredReminders, setFilteredReminders] = useState<any[]>([]);
   const [currentPage, setCurrentPage] = useState<number>(1);
   const [totalPages, setTotalPages] = useState<number>(1);

   const flatListRef = useRef<FlatList>(null);
   const swipeRef = useRef<Array<Swipeable | null>>([]);

   const fetchData = useCallback(async () => {
      try {
         const response = await fetchReminders(currentPage, 10);
         if (currentPage === 1) {
            setReminders(response.docs);
            setFilteredReminders(response.docs);
         } else {
            setFilteredReminders(prevReminders => [
               ...prevReminders,
               ...response.docs,
            ]);
            setFilteredReminders(prevFilteredReminders => [
               ...prevFilteredReminders,
               ...response.docs,
            ]);
         }
         setTotalPages(response.totalPages);
      } catch (error) {
         ToastAndroid.show('Error fetching  ' + error, ToastAndroid.LONG);
      } finally {
         setLoading(false);
         setPageLoading(false);
      }
   }, [currentPage]);

   useEffect(() => {
      fetchData();
   }, [fetchData]);

   const handleSearch = (text: string) => {
      setSearchText(text);

      if (text === '') {
         setFilteredReminders(reminders);
         return;
      }

      const searchTextLower = text.trim().toLowerCase();

      setFilteredReminders(
         reminders.filter(reminder =>
            reminder.name.toLowerCase().includes(searchTextLower),
         ),
      );
   };

   const sortReminders = (isAscending: boolean) => {
      setFilteredReminders(prevReminders => {
         const sortedReminders = [...prevReminders].sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return isAscending ? dateA - dateB : dateB - dateA;
         });
         return sortedReminders;
      });
   };

   const toggleSortOrder = () => {
      setIsAscending(prevIsAscending => {
         const newIsAscending = !prevIsAscending;
         sortReminders(newIsAscending);
         return newIsAscending;
      });
   };

   const refreshList = () => {
      setSearchText('');
      setLoading(true);
      setCurrentPage(1);
      fetchData();
   };

   const handleLoadMore = () => {
      if (currentPage < totalPages) {
         setPageLoading(true);
         setCurrentPage(prevPage => prevPage + 1);
      }
   };

   const handleDelete = async (id: string, index: number) => {
      try {
         setReminders(prevReminders =>
            prevReminders.filter(reminder => reminder.id !== id),
         );
         setFilteredReminders(prevFilteredReminders =>
            prevFilteredReminders.filter(reminder => reminder.id !== id),
         );

         const swipeableRef = swipeRef.current[index];
         if (swipeableRef) {
            swipeableRef.close();
         }

         ToastAndroid.show('Deleted successfully', ToastAndroid.SHORT);
      } catch (error) {
         ToastAndroid.show(
            'Error deleting reminder: ' + error,
            ToastAndroid.LONG,
         );
      }
   };

   const renderItem: ListRenderItem<any> = ({item, index}) => (
      <Swipeable
         ref={ref => {
            swipeRef.current[index] = ref;
         }}
         leftThreshold={0.1}
         renderLeftActions={() => (
            <DeleteButton onPress={() => handleDelete(item.id, index)}>
               <DeleteText>Delete</DeleteText>
            </DeleteButton>
         )}
         overshootRight={false}>
         <MemoizedListItem
            schedule={item.schedule}
            imageSource={item.visualAidUrl}
            name={item.name}
         />
      </Swipeable>
   );

   return (
      <GestureHandlerRootView style={{flex: 1}}>
         <AppContainer>
            <Header />
            <SearchView>
               <SearchBar
                  placeholder="Search here..."
                  value={searchText}
                  onChangeText={handleSearch}
                  width={'84%'}
               />
               <FilterButton onPress={toggleSortOrder}>
                  <FilterIcon
                     source={
                        isAscending
                           ? require('./assets/sort_up.png')
                           : require('./assets/sort_down.png')
                     }
                     resizeMode="contain"
                  />
               </FilterButton>
            </SearchView>

            {!loading ? (
               <FlatList
                  ref={flatListRef}
                  data={filteredReminders}
                  renderItem={renderItem}
                  keyExtractor={(item, index) => index.toString()}
                  onEndReached={() => {
                     if (filteredReminders.length > 0 && searchText === '') {
                        handleLoadMore();
                     }
                  }}
                  onEndReachedThreshold={0.1}
                  ListEmptyComponent={() => (
                     <EmptyText>No routines yet!</EmptyText>
                  )}
                  ListFooterComponent={() =>
                     pageLoading ? (
                        <SpinnerView>
                           <Spinner size={30} color="#182545" />
                        </SpinnerView>
                     ) : (
                        <></>
                     )
                  }
                  refreshControl={
                     <RefreshControl
                        refreshing={loading}
                        onRefresh={() => refreshList()}
                     />
                  }
               />
            ) : (
               <SpinnerView>
                  <Spinner size={30} color="#182545" />
               </SpinnerView>
            )}
         </AppContainer>
      </GestureHandlerRootView>
   );
};

export default App;
