import * as firebase from "firebase/app"
import React, {PropsWithChildren, useContext, useEffect, useReducer} from "react"
import {Config} from "./Config"

interface FirebaseAppState {
    app?: firebase.default.app.App
}

const FIREBASE_UNINITIALIZED: FirebaseAppState = {}
const FirebaseReducer = (state: FirebaseAppState, action: Partial<FirebaseAppState>) => Object.freeze({
    ...state,
    ...action,
})

const FirebaseAppContext = React.createContext<FirebaseAppState>(FIREBASE_UNINITIALIZED)

// workaround for hot reload — in RELEASE, this gets initialized once, but in DEBUG it gets initialized on each recompile and hot reload
let globalApp: firebase.default.app.App | undefined

export const WithFirebaseApp = (props: PropsWithChildren<{}>) => {
    const [firebaseState, dispatch] = useReducer(FirebaseReducer, FIREBASE_UNINITIALIZED)

    // initialize Firebase
    useEffect(() => {
        const firebaseApp: firebase.default.app.App = globalApp || firebase.default.initializeApp(Config.firebaseConfig)
        globalApp = firebaseApp
        dispatch({app: firebaseApp})
        console.log('firebase app:', firebaseApp)
    }, [])

    return (
        <FirebaseAppContext.Provider value={firebaseState}>
            {props.children}
        </FirebaseAppContext.Provider>
    )
}

export const useFirebaseApp = (): FirebaseAppState => useContext(FirebaseAppContext)
