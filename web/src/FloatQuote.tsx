import {createStyles, makeStyles} from "@material-ui/styles"
import React, {PropsWithChildren} from "react"

const useStyles = makeStyles(createStyles({
    float: {
        background: 'rgba(30, 40, 120, 0.4)',
        border: '0.3vmax solid rgba(45, 60, 180, 0.5)',
        position: 'fixed',
        textAlign: 'center',
        bottom: '2vmin',
        left: '2vmin',
        width: 'calc(300px + 10 * ((100vmin - 320px) / 68))',
        // https://css-tricks.com/snippets/css/fluid-typography/
        fontSize: 'calc(24px + 9 * ((100vmin - 320px) / 680))',
        padding: '0.7vmin',
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
