import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { StyleSheet, Text, View, Image, Button, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard} from 'react-native';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import * as SecureStore from 'expo-secure-store';

export default class PostingScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        title: "",
        caption: "",
        tag: "",
        apiReturnMessage: "",
        url: "",
    };
  }

  createPost = () => {
    this.state.title = this.state.title.concat("~@~");
    this.state.caption = this.state.title.concat(this.state.caption);

    SecureStore.getItemAsync('user').then(userid => {
      SecureStore.getItemAsync('session').then(token => {
      //make the api call to the authentication page
      fetch("http://stark.cse.buffalo.edu/cse410/atam/api/postcontroller.php", {
        method: "post",
        body: JSON.stringify({
          action: "addOrEditPosts",
          user_id: userid,
          userid: userid,
          session_token: token,
          posttext: this.state.caption,
          postpicurl: this.state.url,
          // posttype: this.state.tag,
        }),
      })
        .then((res) => res.json())
        .then(
          (result) => {
            this.setState({
              apiReturnMessage: result.Status,
            });
          },
          (error) => {
            alert("error!");
          }
        );
      })
    })
  };

  render(){
    return(
      <TouchableWithoutFeedback onPress={() => {
        Keyboard.dismiss()
      }}>
    <View>
      <View>
      <Text style={{marginLeft:20,marginTop:30}}>Name of the Project:</Text>
        <TextInput
          style={styles.titleinput}
          onChangeText={text => this.setState({ title : text })}
          placeholder="Project Name"
          ref={input => { this.textInput = input }}
        />
      </View>

      <View>
      <Text style={{marginLeft:20}}>Caption:</Text>
        <TextInput
          style={styles.captioninput}
          onChangeText={text => this.setState({ caption : text })}
          placeholder="What's this project about?"
          ref={input => { this.textInput = input }}
        />
      </View>

      <View>
      <Text style={{marginLeft:20}}>URL To Picture: </Text>
        <TextInput
          style={styles.urlinput}
          onChangeText={text => this.setState({ url : text })}
          placeholder="URL"
          ref={input => { this.textInput = input }}
        />
      </View>
        <Button title="Post" onPress={() => this.createPost()} />
    </View>
    </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  contentContainer: {
    paddingTop: 15,
  },
  optionIconContainer: {
    marginRight: 12,
  },
  option: {
    backgroundColor: '#fdfdfd',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: 0,
    borderColor: '#ededed',
  },
  lastOption: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  optionText: {
    fontSize: 15,
    alignSelf: 'flex-start',
    marginTop: 1,
  },
  titleinput:{
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop:10,
    marginBottom: 30,
    backgroundColor:'#fafafa',
    paddingHorizontal: 20
  },
  captioninput : {
    height: 80,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop:10,
    marginBottom: 30,
    backgroundColor:'#fafafa',
    paddingHorizontal: 20,
  },
  urlinput:{
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop:10,
    marginBottom: 30,
    backgroundColor:'#fafafa',
    paddingHorizontal: 20
  }
});
