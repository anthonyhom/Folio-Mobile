import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { MonoText } from '../components/StyledText';
import * as SecureStore from 'expo-secure-store';

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title:"",
      caption:"",
      posts: [],
      error: "",
      isLoaded: "",
    };
    console.log("HI! I need some state here so I can show lots of posts!");
  }

  getTitle = (str) => {
    var separator = str.indexOf("~@~");
    this.state.title = str.substring(0, separator);
    return this.state.title;
  };

  getCaption = (str) => {
    var titleSep = str.indexOf("~@~");
    var collabSep = str.indexOf("~*~");
    if (collabSep !== -1) {
      //Some Collabs
      this.state.caption = str.substring(
        titleSep + 3,
        collabSep
      );
      return this.state.caption;
    } else {
      //No collabs
      this.state.caption = str.substring(
        titleSep + 3,
        str.length
      );
      return this.state.caption;
    }
  };

  componentDidMount(){
    SecureStore.getItemAsync('user').then(userid => {
    fetch("http://webdev.cse.buffalo.edu/cse410/atam/api/postcontroller.php", {
      method: "post",
      body: JSON.stringify({
        action: "getConnectionPosts",
        userid:userid,
        showuserposts: true,
      })
    }).then(response => response.json())
      .then(result => {
        if (result.posts) {
          this.setState({
            posts: result.posts
          });
        }
      }, error => {
        this.setState({
          isLoaded: true,
          error
        });
      }
      );
    });
  }
  render() {

    return (
        <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {this.state.posts.map((post) => (
      <View key={post.post_id} style={styles.card}>
        <Text style={styles.cardTitle}>{post.name}</Text>
        <Image source={{ uri: post.post_pic_url }} style={styles.post_image} />
        <Text style={styles.cardDescription}>{this.getTitle(post.post_text)}</Text>
        <Text style={styles.cardDescription}>{this.getCaption(post.post_text)}</Text>
      </View>
        ))}
        </ScrollView>
      </View>
    );
  }
}

HomeScreen.navigationOptions = {
  header: null,
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 20,
  },
  card: {
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
    backgroundColor: 'white',
    padding: 10,
    marginBottom: 10
  },
  cardTitle: {
    fontSize: 20,
    marginBottom: 10
  },
  cardDescription: {
    fontSize: 12
  },
  post_image: {
    width: 300, 
    height: 200
  }
});
