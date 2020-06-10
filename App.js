import * as React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as SecureStore from 'expo-secure-store';

import BottomTabNavigator from './navigation/BottomTabNavigator';
import LoginScreen from './screens/LoginScreen';


const Stack = createStackNavigator();

export default class App extends React.Component {
  constructor() {
    super()

    this.state = {
      session: null,
      user: null,
    }

    // uncomment this if you'd like to require a login every time the app is started
    SecureStore.deleteItemAsync('session')
  }
  componentDidMount() {
    // Check if there's a session when the app loads
    this.checkIfLoggedIn();
  }
  checkIfLoggedIn = () => {
    // See if there's a session data stored on the phone and set whatever is there to the state
    SecureStore.getItemAsync('session').then(sessionToken => {
      this.setState({
        session: sessionToken
      })
    });

    SecureStore.getItemAsync('user').then(userid => {
      this.setState({
        user: userid
      })
    });

  }
  render() {
    // get our session variable from the state
    const { session } = this.state

    return (
      <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        <NavigationContainer>
          <Stack.Navigator>
            {/* Check to see if we have a session, if so continue, if not login */}
            {session ? (
              <Stack.Screen name="Root" component={BottomTabNavigator} />
            ) : (
                <Stack.Screen
                  name="Login"
                  component={LoginScreen}
                  initialParams={
                    {
                      onLoggedIn: () => this.checkIfLoggedIn()
                    }
                  }
                />
              )}
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});




// class MainContent extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       section: "main",
//       openModal: false,
//       dname: "",
//       posts: "",
//       error: "",
//       isLoaded: "",
//     };
//   }

//   togglePage = (toggle) => {
//     this.setState({ section: toggle });
//   };

//   getDname = () => {
//     fetch("http://stark.cse.buffalo.edu/cse410/atam/api/usercontroller.php", {
//       method: "post",
//       body: JSON.stringify({
//         action: "getUsers",
//         userid: sessionStorage.getItem("user"),
//         user_id: sessionStorage.getItem("user"),
//       }),
//     })
//       .then((res) => res.json())
//       .then((result) => {
//         console.log("this is getUsers", result);
//         if (result.users[0].name !== null) {
//           this.setState({
//             dname: result.users[0].name,
//           });
//           sessionStorage.setItem("dname", result.users[0].name);
//         }
//       });
//   };

//   render() {
//       if (this.state.dname === "") {
//         this.getDname();
//       }
//       if (this.state.dname === "") {
//         return (
//           <View>
//             <View style={styles.col1App-left}></View>
//             <View style={styles.col1App-middle}>
//               <FirstTimeLogin togglePage={this.togglePage} />
//             </View>
//             <View style={styles.col1App-right}></View>
//           </View>
//         );
//       } else {
//         if (this.state.section === "main") {
//           return (
//             <View>
//               <View style={styles.col2App-left}></View>
//               <View style={styles.col2App-middle}>
//                 <PostingList
//                   posts={this.props.posts}
//                   error={this.props.error}
//                   isLoaded={this.props.isLoaded}
//                   onMain={"main"}
//                 />
//               </View>
//               <View style={styles.col2App-right}></View>
//             </View>
//           );
//         } else if (this.state.section === "profile") {
//           // FILTER OUT POSTS TO LOGGED IN USER
//           let myPosts = [];
//           for (var i = 0; i < this.props.posts.length; i++) {
//             if (this.props.posts[i].user_id === sessionStorage.getItem("user")) {
//               myPosts.push(this.props.posts[i]);
//             }
//           }
//           return (
//             <View>
//               <View style={styles.col3App-left}>
//                 <Profile userid={sessionStorage.getItem("user")} />
//               </View>
//               <View style={styles.col3App-middle}>
//                 <PostingList
//                   posts={myPosts}
//                   error={this.props.error}
//                   isLoaded={this.props.isLoaded}
//                   onMain={"profile"}
//                 />
//               </View>
//             </View>
//           );
//         } else {
//           return <Text>Unidentified Section!</Text>;
//         }
//       }
//     }
//   }
  
//   function setMenuOption(mode, maincontent, e) {
//     maincontent.current.setState({
//       section: mode,
//     });
//   }
  
//   function toggleModal(app) {
//     app.setState({
//       openModal: !app.state.openModal,
//     });
//   }
  
//   class App extends React.Component {
//     constructor(props) {
//       super(props);
//       this.state = {
//         openModal: false,
//         page: "login",
//         posts: [],
//         error: "",
//         isLoaded: false,
//       };
//     }
  
//     componentDidMount() {
//       this.loadPosts();
//     }
  
//     loadPosts = () => {
//       fetch("http://stark.cse.buffalo.edu/cse410/atam/api/postcontroller.php", {
//         method: "post",
//         body: JSON.stringify({
//           action: "getConnectionPosts",
//           userid: sessionStorage.getItem("user"),
//           showuserposts: true,
//         }),
//       })
//         .then((res) => res.json())
//         .then(
//           (result) => {
//             // console.log(result)
//             if (result.posts) {
//               this.setState({
//                 isLoaded: true,
//                 posts: result.posts,
//               });
//             }
//           },
//           (error) => {
//             this.setState({
//               isLoaded: true,
//               error: error,
//             });
//           }
//         );
//       setTimeout(() => {
//         this.loadPosts();
//       }, 60000);
//     };
    
//     render() {

//       let mainContent = React.createRef();
//       let folioLogo = require("./logo.svg");
//       let home = require("./Images/home.svg");
//       let profile = require("./Images/profile.svg");
  
//       if (!sessionStorage.getItem("token")) {
//         return (
//           <View className="App">
//             <View className="row App-body">
//               <View className="col-md-2 col-3 App-left"></View>
//               <View className="col-md-8 col-6 App-middle">
//                 <SignUp togglePage={this.togglePage} loadPosts={this.loadPosts} />
//               </View>
//               <View className="col-md-2 col-3 App-right"></View>
//             </View>
//           </View>
//         );
//       } else {
//         return (
//           <View className="App">
//             <ul className="row col-12 navbar">
//               {/* Folio Home Button */}
//               <li className="col-sm-2 col-md-3 col-6 folio-logo">
//                 <img
//                   alt=""
//                   src={folioLogo}
//                   className="folio-img"
//                   onClick={(e) => setMenuOption("main", mainContent, e)}
//                 />
//               </li>
  
//               {/* New Post Button */}
//               <View className="col-sm-10 col-md-9 col-6 page-group">
//                 <li className="new-post-button">
//                   <button
//                     className="new-post"
//                     onClick={(e) => toggleModal(this, e)}
//                   >
//                     <span>New Post</span>
//                   </button>
//                 </li>
  
//                 {/* Home Button */}
//                 <li className=" page-button">
//                   <img
//                     alt=""
//                     src={home}
//                     className="button-icon"
//                     onClick={(e) => setMenuOption("main", mainContent, e)}
//                   />
//                 </li>
  
//                 {/* Profile Page */}
//                 <li className=" page-button">
//                   <img
//                     alt=""
//                     src={profile}
//                     className="button-icon"
//                     onClick={(e) => setMenuOption("profile", mainContent, e)}
//                   />
//                 </li>
//               </View>
//             </ul>
//             <View className="row App-body">
//               <MainContent
//                 ref={mainContent}
//                 posts={this.state.posts}
//                 error={this.state.error}
//                 isLoaded={this.state.isLoaded}
//               />
//               <PostForm
//                 show={this.state.openModal}
//                 onClose={(e) => toggleModal(this, e)}
//                 loadPosts={this.loadPosts}
//               />
//               <View className="fab" onClick={(e) => toggleModal(this, e)}>
//                 +
//               </View>
//             </View>
//           </View>
//         );
//       }
//     }
//   }