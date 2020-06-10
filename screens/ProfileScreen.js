import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { StyleSheet, Text, View, Image, Modal, TouchableOpacity } from 'react-native';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import * as SecureStore from 'expo-secure-store';
import { MaterialIcons } from  '@expo/vector-icons'

export default class ProfileScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      fname: "",
      lname: "",
      profilePic: "https://www.svgrepo.com/show/213315/avatar-profile.svg",
      artifactID: "",
      session: null,
      user: null,
      user_arr:[],
      followers_lst:[],
      following_lst:[],
      bio: "Hey Update Me!",
      modalOpen1: false,
      modalOpen2: false,
      posts:[],
      title:"",
      caption:""
    };
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

  loadConnections = () => {
    SecureStore.getItemAsync('user').then(userid => {
    fetch(
      "http://stark.cse.buffalo.edu/cse410/atam/api/connectioncontroller.php",
      {
        method: "post",
        body: JSON.stringify({
          action: "getConnections",
          userid: userid,
        }),
      }
    )
      .then((res) => res.json())
      .then(
        (result) => {
          if (result.connections !== undefined) {
            this.setState({
              following_lst: result.connections,
            });
          }
          console.log(result);
        },
        (error) => {
          this.setState({
            error,
          });
        }
      );
    })
  };

  loadConnections2 = () => {
    SecureStore.getItemAsync('user').then(userid => {
    fetch(
      "http://stark.cse.buffalo.edu/cse410/atam/api/connectioncontroller.php",
      {
        method: "post",
        body: JSON.stringify({
          action: "getConnections",
          connectuserid: userid,
        }),
      }
    )
      .then((res) => res.json())
      .then(
        (result) => {
          if (result.connections !== undefined) {
            this.setState({
              followers_lst: result.connections,
            });
          }
        },
        (error) => {
          this.setState({
            error,
          });
        }
      );
    })
  };

  getPosts = () => {
    SecureStore.getItemAsync('user').then(userid => {
    fetch(
      "http://webdev.cse.buffalo.edu/cse410/atam/api/postcontroller.php",
      {
        method: "post",
        body: JSON.stringify({
          action: "getPosts",
          userid: userid,
        }),
      }
    )
      .then((res) => res.json())
      .then(
        (result) => {
          if (result.posts) {
            this.setState({
              posts:result.posts,
            });
          }
        },
        (error) => {
          this.setState({
            error,
          });
        }
      );
    })
  };

  componentDidMount(){
    // this.checkIfLoggedIn();
    this.getUsername();
    this.getUserArtifacts(
      "profilePic",
      this.state.profilePic
    );
    this.getUserArtifacts(
      "bio",
      this.state.bio
    );
    this.loadConnections();
    this.loadConnections2();
    this.getPosts();
  }

  getUsername = () => {
    SecureStore.getItemAsync('user').then(userid => {
    fetch("http://stark.cse.buffalo.edu/cse410/atam/api/usercontroller.php", {
      method: "post",
      body: JSON.stringify({
        action: "getUsers",
        userid: userid,
      }),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          console.log(result.users[0]);
          this.setState({
            user_arr:result.users[0],
            fname: result.users[0].first_name,
            lname: result.users[0].last_name,
          });
        },
        (error) => {
          alert("error!");
        }
      );
    })
  };

  getUserArtifacts = (artifact_cat, artifact_item) => {
    SecureStore.getItemAsync('user').then(userid => {
    fetch("http://stark.cse.buffalo.edu/cse410/atam/api/uacontroller.php", {
      method: "post",
      body: JSON.stringify({
        action: "getUserArtifacts",
        userid: userid,
        artifactcategory: artifact_cat,
      }),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          if (result.user_artifacts === undefined) {
            return fetch(
              "http://stark.cse.buffalo.edu/cse410/atam/api/uacontroller.php",
              {
                method: "post",
                body: JSON.stringify({
                  action: "addOrEditUserArtifacts",
                  user_id: user,
                  userid: user,
                  session_token: session,
                  artifacttype: "profileSettings",
                  artifactcategory: artifact_cat,
                  artifacturl: artifact_item,
                }),
              }
            )
              .then((resp) => resp.json())
              .then(
                (response) => {},
                (error) => {
                  alert("error!");
                }
              );
          } else {
            if (artifact_cat === "profilePic") {
              this.setState({
                profilePic: result.user_artifacts[0].artifact_url,
              });
            }
            else if (artifact_cat === "bio") {
              this.setState({
                bio: result.user_artifacts[0].artifact_url,
              });
            }
          }
        },
        (error) => {
          alert("error!");
        }
      );
    })
  };

  setModalOpen1 = () => {
      this.setState({
        modalOpen1: true
      })
    }

    setModalOpen2 = () => {
      this.setState({
        modalOpen2: true
      })
    }

  setModalClose = () => {
    this.setState({
      modalOpen1: false,
      modalOpen2:false,
    })
  }

render(){
  console.log(this.state.user_arr)
  // console.log(this.state.fname)
  // console.log(this.state.session)
  // console.log(this.state.user)

  return (
    <ScrollView style={{alignSelf:"center"}}>
      <View style={styles.profileImage}>
        <Image source={{uri: this.state.profilePic}} style={styles.image} resizeMode="center"/>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.username}>
          {this.state.fname} {this.state.lname}
        </Text>
        <Text style={styles.biotag}>
          {this.state.bio}
        </Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statsBox}>
          <Text style={{fontSize:24}}>{this.state.posts.length}</Text>
          <Text style={{fontSize:12,textTransform:"uppercase",fontWeight:"500"}}>Posts</Text>
        </View>
        <TouchableOpacity onPress={() => this.setModalOpen1()} style={[styles.statsBox, {borderColor: "#DFD8CB", borderLeftWidth: 1, borderRightWidth: 1}]}>
          <Text style={{fontSize:24}}>{this.state.followers_lst.length}</Text>
          <Text style={{fontSize:12,textTransform:"uppercase",fontWeight:"500"}}>Followers</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.setModalOpen2()} style={styles.statsBox}>
          <Text style={{fontSize:24}}>{this.state.following_lst.length}</Text>
          <Text style={{fontSize:12,textTransform:"uppercase",fontWeight:"500"}}>Following</Text>
        </TouchableOpacity>
      </View>

      <View style={{marginTop:32}}>
      <View style={styles.container} contentContainerStyle={styles.contentContainer}>
      {this.state.posts.map((post) => (
      <View key={post.post_id} style={styles.card}>
        <Text style={styles.cardTitle}>{post.name}</Text>
        <Image source={{ uri: post.post_pic_url }} style={styles.post_image} />
        <Text style={styles.cardDescription}>{this.getTitle(post.post_text)}</Text>
        <Text style={styles.cardDescription}>{this.getCaption(post.post_text)}</Text>
      </View>
        ))}
        </View>
      </View>



      <Modal visible={this.state.modalOpen1} animationType='slide'>
        <View>

        <MaterialIcons
        name = 'arrow-back'
        size={24}
        onPress={() => this.setModalClose()}
        style={styles.goback}
        />

        <ScrollView style={styles.modalScroll}>
        <Text> Followers: </Text>
        {this.state.followers_lst.map((follower) => (

          <Text key={follower.connection_id}style={styles.modalContent}>{follower.user_name}</Text>

        ))}
        </ScrollView>
      </View>
      </Modal>

      <Modal visible={this.state.modalOpen2} animationType='slide'>
        <View>

        <MaterialIcons
        name = 'arrow-back'
        size={24}
        onPress={() => this.setModalClose()}
        style={styles.goback}
        />

        <ScrollView style={styles.modalScroll}>
        <Text> Following: </Text>

        {this.state.following_lst.map((following) => (
          <Text key={following.connection_id} style={styles.modalContent}>{following.name}</Text>
        ))}
        </ScrollView>
      </View>
      </Modal>



    </ScrollView>

      );
    
    }
  }

const styles = StyleSheet.create({
  username: {
    fontWeight:"200",
    fontSize:36,
    color: "#525750"
  },
  biotag: {
    fontSize:14,
    color: "#525750"
  },
  contentContainer: {
    paddingTop: 15,
  },
  optionIconContainer: {
    marginRight: 12,
  },
  modalContent:{
    alignSelf:'center',
    marginTop: 10,
  },
  modalToggle:{
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#f2f2f2',
    padding: 10,
    borderRadius:10,
    alignSelf:'center'
  },
  modalScroll:{
    marginTop: 10
  },
  goback:{
    marginTop: 5,
  },
  profileImage:{
    width:200,
    height:200,
    borderRadius:100,
    overflow:"hidden",
    alignSelf:"center"
  },
  image:{
    flex: 1,
    width:undefined,
    height:undefined
  },
  infoContainer:{
    alignSelf:"center",
    alignItems:"center",
    marginTop: 16
  },
  statsContainer:{
    flexDirection:"row",
    alignSelf:"center",
    marginTop:32,
  },
  statsBox:{
    alignItems:"center",
    flex:1
  },
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
