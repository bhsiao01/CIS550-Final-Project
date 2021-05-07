import React, { useEffect, useState } from 'react'
import axios from 'axios'
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import {
  Box,
  Button
} from '@material-ui/core'
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

const IfUnAuthed = () => {
  const [mouseX, setMouseX] = useState(0)
  const [mouseY, setMouseY] = useState(0)
  return (
    <div
        onMouseMove={(e) => {
          setMouseX((e.pageX / window.innerWidth) * 100)
          setMouseY((e.pageY / window.innerHeight) * 100)
        }}
        style={{
          height: '100vh',
          background:
            'radial-gradient(at ' +
            mouseX +
            '% ' +
            mouseY +
            '%, #e3def1, #def1e7)',
        }}>
      <div className="white-bg">
      <FirebaseAuthProvider {...config} firebase={firebase}>
        <div className="sign-in">
          <FirebaseAuthConsumer>
            {({ isSignedIn, firebase }) => {
                return (
                  <div>
                    <h1 style={{ textAlign: 'center', fontSize: '4em', letterSpacing: '3px' }} className="header">Vision</h1>
                    <h1 className="owl">🦉</h1>
                    <h2 className="sign-in-h2">Sign In </h2>
                    <div className="buttons-wrap">
                      <div className="buttons-1">
                      <Link to="/home" style={{ textDecoration: 'none' }}>
                        <Box m={2}>
                        <Button variant="contained" color="primary"
                      onClick={() => {
                        const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
                        firebase.auth().signInWithRedirect(googleAuthProvider);
                      }}
                    >
                      Sign in with Google
                    </Button>
                        </Box>
                    
                    </Link>
                      </div>
                      <div className="buttons-2">
                      <Link to="/home" style={{ textDecoration: 'none' }}> 
                      <Box m={2}>
                      <Button variant="contained" color="primary"
                    onClick={() => {
                      const fbAuthProvider = new firebase.auth.FacebookAuthProvider();
                      firebase
                      .auth()
                      .signInWithRedirect(fbAuthProvider)
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
                      </Box>
                    </Link>
                    <p className="text-1"> Powered by Jasmine Cao, Bethany Hsiao, </p>
                     <p className="text-2"> Sabhya Raju, Claire Wang </p>
                      </div>
                    </div>
                    
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