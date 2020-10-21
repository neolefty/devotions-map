import {createStyles, makeStyles} from "@material-ui/styles"
import React, {PropsWithChildren} from "react"

const useStyles = makeStyles(createStyles({
    float: {
        background: 'rgba(30, 40, 120, 0.4)',
        border: '0.3vmax solid rgba(45, 60, 180, 0.5)',
        position: 'fixed',
        textAlign: 'center',
        bottom: '1.5vmax',
        left: '1.5vmax',
        width: '30vmax',
        fontSize: '2vmax',
        padding: '0.5vmax',
        fontFamily: 'georgia',
        fontStyle: 'italic',
        borderRadius: '0.5rem',
    },
}))

export const FloatQuote = (props: PropsWithChildren<{}>) => {
    const classes = useStyles()
    return (
        <div className={classes.float}>{props.children}</div>
    )
}
