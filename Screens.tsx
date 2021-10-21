import React, {useState,useEffect} from 'react';
import {RouteProp} from '@react-navigation/core';
import {StackNavigationProp} from '@react-navigation/stack';
import {
    View,
    Text,
    TextInput,
    Button,
    TouchableOpacity,
    StyleSheet,
    Alert,
    FlatList,
    SafeAreaView,ActivityIndicator
  } from 'react-native';
import {RootStackParamList} from './App';
import axios from 'axios';
import filter from 'lodash.filter'


type ScreenNavigationProp<
  T extends keyof RootStackParamList
> = StackNavigationProp<RootStackParamList, T>;

type ScreenRouteProp<T extends keyof RootStackParamList> = RouteProp<
  RootStackParamList,
  T
>;
type Props<T extends keyof RootStackParamList> = {
  route: ScreenRouteProp<T>;
  navigation: ScreenNavigationProp<T>;
};
export const HomeScreen: React.FC<Props<'HomeScreen'>> = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState([]);
  const [offset, setOffset] = useState(1);
  const [query, setQuery] = useState('');
  const [fullData, setFullData] = useState([]);

  useEffect(() => getData(), []);

  const getData = () => {
    console.log('getData');
    setLoading(true);
    //Service to get the data from the server to render
    fetch('https://hn.algolia.com/api/v1/search_by_date?tags=story&page='
          + offset)
      //Sending the currect offset with get request
      .then((response) => response.json())
      .then((responseJson) => {
        //Successful response
        setOffset(offset + 1);
        //Increasing the offset for the next API call
        setDataSource([...dataSource, ...responseJson.hits]);
        setFullData([...dataSource, ...responseJson.hits]);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const renderFooter = () => {
    return (
      //Footer View with Load More button
      <View style={styles.footer}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={getData}
          //On Click of button load more data
          style={styles.loadMoreBtn}>
          <Text style={styles.btnText}>Load More</Text>
          {loading ? (
            <ActivityIndicator
              color="white"
              style={{marginLeft: 8}} />
          ) : null}
        </TouchableOpacity>
      </View>
    );
  };

  const ItemView = ({item}) => {
    return (
      // Flat List Item
      <TouchableOpacity
      style={{padding:10,}}
      onPress={() => 
          navigation.navigate('DetailsScreen', {
            name:JSON.stringify(item),
            nasaJplUri:JSON.stringify(item.url),
            isPotentiallyHazardousAsteroid:JSON.stringify(item.author)
          
          })
      }
      >
       <View style={styles.item}>
        <Text>item: {item.title}
        </Text>
        <Text>URL: {item.url}
        </Text>
        <Text>author name: {item.author}
        </Text>
        </View>


      </TouchableOpacity>
     
      // <Text
      //   style={styles.itemStyle}
      //   onPress={() => getItem(item)}>
      //   {item.id}
      //   {'.'}
      //   {item.title.toUpperCase()}
      // </Text>
    );
  };

  const ItemSeparatorView = () => {
    return (
      // Flat List Item Separator
      <View
        style={{
          height: 0.5,
          width: '100%',
          backgroundColor: '#C8C8C8',
        }}
      />
    );
  };

  const getItem = (item) => {
    //Function for click on an item
    alert('Id : ' + item.objectID + ' Title : ' + item.title);
  };

  function renderHeader() {
    return (
      <View
        style={{
          backgroundColor: '#fff',
          padding: 10,
          marginVertical: 10,
          borderRadius: 20
        }}
      >
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="always"
          value={query}
          onChangeText={queryText => handleSearch(queryText)}
          placeholder="Search title ,url and author"
          style={{ backgroundColor: '#fff', paddingHorizontal: 20 }}
        />
      </View>
    );
  }

  const handleSearch = text => {
    const formattedQuery = text.toLowerCase();
    const filteredData = filter(fullData, item => {
      return contains(item, formattedQuery);
    });
    setDataSource(filteredData);
    setQuery(text);
  };
  
  const contains = ({ title, url ,author}, query) => {
   // const { first, last } = name;
  
    if (title.includes(query) || url.includes(query) || author.includes(query)) {
      return true;
    }
  
    return false;
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <FlatList
          ListHeaderComponent={renderHeader}
          data={dataSource}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={ItemSeparatorView}
          enableEmptySections={true}
          renderItem={ItemView}
          ListFooterComponent={renderFooter}
        />
      </View>
    </SafeAreaView>
  );
};

export const DetailsScreen: React.FC<Props<'DetailsScreen'>> = ({route}) => {
  const {name,nasaJplUri,isPotentiallyHazardousAsteroid} = route.params;

return (
    <View style={{flex: 1, alignItems: 'flex-start', justifyContent: 'flex-start',padding:20}}>
     
      <Text style={styles.titleText}>Item json : <Text style={styles.valueText}>{name}</Text></Text>
      {/* <Text style={styles.titleText}>NasaJplUri : <Text style={styles.valueText}>{nasaJplUri}</Text></Text>
      <Text style={styles.titleText}>IsPotentiallyHazardousAsteroid : <Text style={styles.valueText}>{isPotentiallyHazardousAsteroid}</Text></Text> */}
      {/* <Text>{otherParam}</Text> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    flex: 1,
  },
  footer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  loadMoreBtn: {
    padding: 10,
    backgroundColor: '#800000',
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: 'white',
    fontSize: 15,
    textAlign: 'center',
  },  
  heading: {
      marginTop:20,
      margin:20
      
      
    },
    form: {
      marginTop: 5,
    },
    input: {
      padding: 15,
      borderColor: 'rgba(0, 0, 0, 0.2)',
      borderWidth: 1,
      borderRadius: 5,
      marginBottom: 20,
    },
    textView: {
      padding: 5,
      borderColor: 'rgba(0, 0, 0, 0.2)',
      marginBottom: 20,
      color: '#000',
      fontWeight: '800'
    },
    addItemButton: {
      backgroundColor: '#eb8634',
      paddingVertical: 20,
      borderRadius: 5,
      alignItems: 'center',
    },
    item: {
      height: 100,
      backgroundColor : '#e3e3e3',
      marginVertical : 6,
      justifyContent : 'center',
      alignItems : 'center',
      margin : 12,
      padding:10,
      borderRadius : 5,
  },
    buttonText: {color: '#000',marginBottom:10,  fontSize: 20,fontWeight: "bold"},
   
    titleText: {color: '#000',marginBottom:10,  fontSize: 14,fontWeight: "bold"},
    valueText: {color: '#000',marginBottom:10,  fontSize: 13,fontWeight: "500"},

  })


  