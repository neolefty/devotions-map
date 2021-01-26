import {makeStyles} from "@material-ui/styles"
// import firebase from "firebase"
import firebase from "firebase/app"
import React, {useEffect, useMemo} from 'react'
import {useAuthState} from "react-firebase-hooks/auth"
// import {StyledFirebaseAuth} from "react-firebaseui"
import {DevotionsMap} from "./DevotionsMap"
import {InfoOverlay} from "./InfoOverlay"
import {WithDevotions} from "./WithDevotions"
import {useFirebaseApp, WithFirebaseApp} from "./WithFirebaseApp"

// TODO — see https://trello.com/b/5Rcw3uQv/devotions-map
// 1. chevron on Quote box to show / hide explanation
// 2. try out https://www.dafont.com/linux-libertine.font for quote

// initialize styles
const useStyles = makeStyles({})

export const App = () => {
    useStyles()
    return (
        <WithFirebaseApp>
            <WithDevotions>
                <DevotionsMap/>
                <InfoOverlay/>
                <FirebaseSignin/>
            </WithDevotions>
        </WithFirebaseApp>
    )
}

const FirebaseSignin = () => {
    const [user, loading, error] = useAuthState(firebase.auth())
    return <div>Auth</div>
}

/*
const FirebaseSignin = () => {
    const firebaseApp = useFirebaseApp()
    const firebaseAuth = firebase.auth
    const uiConfig = useMemo(() =>
        firebaseAuth && {
            signInFlow: 'popup',
            signInSuccessUrl: '/signedIn',
            signInOptions: [
                firebaseAuth.GoogleAuthProvider.PROVIDER_ID,
                firebaseAuth.FacebookAuthProvider.PROVIDER_ID,
            ],
        }
    , [firebaseAuth])
    useEffect(() => console.log('firebase.auth =', firebaseAuth), [firebaseAuth])
    console.log('firebase.auth', firebase.auth, 'firebase.app.auth', firebaseApp.app?.auth)
    return (
        <>{firebaseApp.app && firebase.auth &&
            <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth() /*firebaseApp.app.auth()}/>
        }</>
    )
}
*/
