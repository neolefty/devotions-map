import {createContext, PropsWithChildren} from "react"

interface AuthState {
    user: any
    signin: any
    signup: any
    signout: any
    sendPasswordResetText: any
    confirmPasswordReset: any
}

const DEFAULT_AUTH_STATE: AuthState = {
    confirmPasswordReset: undefined,
    sendPasswordResetText: undefined,
    signin: undefined,
    signout: undefined,
    signup: undefined,
    user: undefined
}

const AuthContext = createContext<AuthState>(DEFAULT_AUTH_STATE)

// from https://usehooks.com/useAuth/
export const WithAuth = (props: PropsWithChildren<{}>) => {
    return (
        <div>WithAuth</div>
    )
}
