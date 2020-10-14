import {createStyles, makeStyles} from "@material-ui/styles"
import React, {PropsWithChildren} from "react"

const useStyles = makeStyles(createStyles({
    float: {
        background: 'rgba(30, 40, 120, 0.8)',
        border: '1px solid rgba(45, 60, 180, 0.7)',
        position: 'fixed',
        bottom: '20px',
        right: 0,
        // maxWidth: '20vw',
        fontSize: '14px',
        padding: '5px',
    }
}))

export const LastUpdated = (props: PropsWithChildren<{}>) => {
    const classes = useStyles()
    return (
        <div className={classes.float}>{props.children}</div>
    )
}
