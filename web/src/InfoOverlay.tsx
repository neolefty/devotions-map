import {createStyles, makeStyles} from "@material-ui/styles"
import {format} from "date-fns"
import React, {useEffect, useState} from "react"
import {FloatKey} from "./FloatKey"
import {FloatQuote} from "./FloatQuote"
import {useDevotions} from "./useDevotions"

const useStyles = makeStyles(createStyles({
    attribute: {
        paddingRight: '1vmin',
        fontStyle: 'normal',
        textAlign: 'right',
        marginTop: '0.3vmin',
    },
}))
export const InfoOverlay = () => {
    const classes = useStyles()
    const [latest, setLatest] = useState<Date | undefined>()

    return (
        <>
            <GetLatest setLatest={setLatest}/>
            <FloatKey>
                <LastUpdated latest={latest}/>
            </FloatKey>
            <FloatQuote>
                &ldquo;Let the flame of the love of God burn brightly within your radiant hearts.&rdquo;
                <div className={classes.attribute}>
                    <a href="https://www.bahai.org/r/413529355">Bahá&rsquo;u&rsquo;lláh</a>
                </div>
            </FloatQuote>
        </>
    )
}

interface LastUpdatedProps {
    latest?: Date
}

const LastUpdated = (props: LastUpdatedProps) => {
    const devotions = useDevotions()
    return (
        <>
            <p>
                Stars represent {devotions?.length} households<br/>
                with <a href="https://www.bahai.org/action/devotional-life/">devotional gatherings</a>.
                {props.latest &&
                <>
                    <br/>
                    Most recent: {format(props.latest, 'M/d/yyyy')}.
                </>
                }
            </p>
            <p>
                Official statistics report 237<br/>
                — <a href="https://midwestbahai.org/devotions-points-of-light/#form">add yours to the map</a>
            </p>
        </>
    )
}

interface GetLatestProps {
    setLatest: (latest: Date) => void
}

const GetLatest = ({setLatest}: GetLatestProps) => {
    const descriptions = useDevotions()
    useEffect(() => {
        if (descriptions) {
            const latest = descriptions.reduce((soFar, description) =>
                    description.timestamp.getTime() > soFar.getTime() ? description.timestamp : soFar,
                new Date(0)
            )
            if (latest)
                setLatest(latest)
        }
    }, [setLatest, descriptions])
    return <></>
}
