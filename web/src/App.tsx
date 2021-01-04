import firebase from "firebase/app"
import React, {PropsWithChildren, useEffect, useReducer} from 'react'
import {Config} from "./Config"
import {DevotionsMap} from "./DevotionsMap"
import {InfoOverlay} from "./InfoOverlay"
import {WithDevotions} from "./WithDevotions"

// TODO -- see https://trello.com/b/5Rcw3uQv/devotions-map
// 1. chevron on Quote box to show / hide explanation
// 2. try out https://www.dafont.com/linux-libertine.font for quote

export const App = () => {
    return (
        <WithFirebase>
            <WithDevotions>
                <DevotionsMap/>
                <InfoOverlay/>
            </WithDevotions>
        </WithFirebase>
    )
}

interface FirebaseState {
    app?: firebase.app.App
}

const FIREBASE_UNINITIALIZED: FirebaseState = {
}

const FirebaseReducer = (state: FirebaseState, action: Partial<FirebaseState>) => Object.freeze({
    ...state,
    ...action,
})

export const FirebaseContext = React.createContext<FirebaseState>(FIREBASE_UNINITIALIZED)

export const WithFirebase = (props: PropsWithChildren<{}>) => {
    const [firebaseState, dispatch] = useReducer(FirebaseReducer, FIREBASE_UNINITIALIZED)
    useEffect(() => {
        const firebaseApp: firebase.app.App = firebase.initializeApp(Config.firebaseConfig)
        dispatch({app: firebaseApp})
        console.log('firebase app:', firebaseApp)
    }, [])
    return (
        <FirebaseContext.Provider value={firebaseState}>
            {props.children}
        </FirebaseContext.Provider>
    )
}
