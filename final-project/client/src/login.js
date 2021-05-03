import React, { useEffect, useState } from 'react'
import axios from 'axios'
import firebase from "firebase/app";
import "firebase/auth";
import {
  FirebaseAuthProvider,
  FirebaseAuthConsumer,
  IfFirebaseAuthed,
  IfFirebaseUnAuthed
} from "@react-firebase/auth";

import { config } from "./config-fb";


const IfUnAuthed = () => {
  return (
    <div>
      <FirebaseAuthProvider {...config} firebase={firebase}>
        <div>
          <FirebaseAuthConsumer>
            {({ isSignedIn, firebase }) => {
              if (isSignedIn === true) {
                return (
                  <div>
                    <h2>You're signed in 🎉 </h2>
                    <button
                      onClick={() => {
                        firebase
                          .app()
                          .auth()
                          .signOut();
                      }}
                    >
                      Sign out
                    </button>
                  </div>
                );
              } else {
                return (
                  <div>
                    <h2>You're not signed in </h2>
                    <button
                      onClick={() => {
                        firebase
                          .app()
                          .auth()
                          .signInAnonymously();
                      }}
                    >
                      Sign in anonymously
                    </button>
                    <button
                      onClick={() => {
                        const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
                        firebase.auth().signInWithPopup(googleAuthProvider);
                      }}
                    >
                      Sign in with Google
                    </button>
                    
                  </div>
                );
              }
            }}
          </FirebaseAuthConsumer>
        </div>
      </FirebaseAuthProvider>
    </div>
  );
};

// const IfUnAuthed = () => {
//   return (
//     <div>
//       <IfFirebaseAuthed>
//     {() => (
//       <div>
//         <h2>You're signed in 🎉 </h2>
//         <button
//           onClick={() => {
//             firebase
//               .app()
//               .auth()
//               .signOut();
//           }}
//         >
//           Sign out
//         </button>
//       </div>
//     )}
//   </IfFirebaseAuthed>
//   <IfFirebaseUnAuthed>
//     {() => (
//       <div>
//         <h2>You're not signed in </h2>
//         <button
//           onClick={() => {
//             firebase
//               .app()
//               .auth()
//               .signInAnonymously();
//           }}
//         >
//           Sign in anonymously
//         </button>
//         <button
//         onClick={() => {
//           const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
//           firebase.auth().signInWithPopup(googleAuthProvider);

//         }}
//       >
//         Sign in with Google
//       </button>
//       </div>
//     )}
//   </IfFirebaseUnAuthed>
//     </div>
//   )};

// const signIn = () => {
//   var provider = new firebase.auth.GoogleAuthProvider();
//   console.log('reached here')
//   firebase.auth().signInWithPopup(provider);
  
//   // firebase.auth()
//   // .getRedirectResult()
//   // .then((result) => {
//   //   if (result.credential) {
//   //     /** @type {firebase.auth.OAuthCredential} */
//   //     var credential = result.credential;
//   //     // This gives you a Google Access Token. You can use it to access the Google API.
//   //     var token = credential.accessToken;
//   //     // ...
//   //   }
//   //   // The signed-in user info.
//   //   var user = result.user;
//   // }).catch((error) => {
//   //   // Handle Errors here.
//   //   var errorCode = error.code;
//   //   var errorMessage = error.message;
//   //   // The email of the user's account used.
//   //   var email = error.email;
//   //   // The firebase.auth.AuthCredential type that was used.
//   //   var credential = error.credential;
//   //   // ...
//   // });
// }

export default IfUnAuthed;