import React, { useEffect, useState } from 'react'
import axios from 'axios'
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { Button } from '@material-ui/core'
import back from "./back.jpg";
import './Login.css'
import { Link } from 'react-router-dom'
import {
  FirebaseAuthProvider,
  FirebaseAuthConsumer,
  IfFirebaseAuthed,
  IfFirebaseUnAuthed
} from "@react-firebase/auth";

import { config } from "./config-fb";
//require("firebase/firestore");

firebase.initializeApp({
  apiKey: "AIzaSyBdCS2X1K6au2OCZoRtfAW076MKUV10G8Q",
  authDomain: "cis550-finalproject.firebaseapp.com",
  projectId: "cis550-finalproject",
  storageBucket: "cis550-finalproject.appspot.com",
  messagingSenderId: "463552796024",
  appId: "1:463552796024:web:d4bc97e1f8677e174fa48d",
  measurementId: "G-VPS7BWYP5F"
});

//  const db = firebase.firestore();

// db.collection("users").add({
//   first: "Ada",
//   last: "Lovelace",
//   born: 1815
// })
// .then((docRef) => {
//   console.log("Document written with ID: ", docRef.id);
// })
// .catch((error) => {
//   console.error("Error adding document: ", error);
// });


const IfUnAuthed = () => {
  // const user = firebase.auth().currentUser;
  // const name = ''
  return (
    <div style={{  
      backgroundImage: `url(${back})` ,
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      width: '100%', 
      height: '100vh'
    }} className="img-bg">
      <div className="white-bg">
      <FirebaseAuthProvider {...config} firebase={firebase}>
        <div className="sign-in">
          <FirebaseAuthConsumer>
            {({ isSignedIn, firebase }) => {
                return (
                  <div>
                    <h2 className="sign-in-h2">You're not signed in </h2>
                    <Link to="/" style={{ textDecoration: 'none' }}>
                    <Button variant="contained" color="primary" className="button-1"
                      onClick={() => {
                        firebase
                          .app()
                          .auth()
                          .signInAnonymously();
                      }}
                    >
                      Sign in anonymously
                    </Button>
                    </Link>
                    <Link to="/" style={{ textDecoration: 'none' }}>
                    <Button variant="contained" color="primary"
                      onClick={() => {
                        const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
                        firebase.auth().signInWithPopup(googleAuthProvider);
                      }}
                    >
                      Sign in with Google
                    </Button>
                    </Link>
                    <Link to="/" style={{ textDecoration: 'none' }}> 
                    <Button variant="contained" color="primary"
                    onClick={() => {
                      const fbAuthProvider = new firebase.auth.FacebookAuthProvider();
                      firebase
                      .auth()
                      .signInWithPopup(fbAuthProvider)
                      .then((result) => {
                        /** @type {firebase.auth.OAuthCredential} */
                        const credential = result.credential;
                    
                        // The signed-in user info.
                        const user = result.user;
                    
                        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
                        const accessToken = credential.accessToken;
                    
                        // ...
                      })
                      .catch((error) => {
                        // Handle Errors here.
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        // The email of the user's account used.
                        const email = error.email;
                        console.log(error)
                        // The firebase.auth.AuthCredential type that was used.
                        const credential = error.credential;
                        // ...
                      });
                    }}
                    >
                      Sign in with Facebook
                    </Button>
                    </Link>
                  </div>
                  
                );
            }}
          </FirebaseAuthConsumer>
        </div>
      </FirebaseAuthProvider>
      </div>
    </div>
  );
};

export default IfUnAuthed;