import React, {useEffect, useState} from "react"
import {ButtonGroup, Button, Row, Col} from "reactstrap"

const Star = ({owner, repo, ...otherProps}) => {
    const [count, setCount] = useState(0)

    useEffect(() => {
        fetch(`https://api.github.com/repos/${owner}/${repo}`)
            .then((res) => res.json()).then((res) => {
            setCount(res.stargazers_count);
        })
    }, [])

    return (
        <ButtonGroup size="sm" {...otherProps}>
            <Button tag="a" href={`https://github.com/${owner}/${repo}`} target="_blank">
                <img src="/static/img/star.svg" className="img-xs"/>
                <span>Star</span>
            </Button>
            <Button tag="a" href={`https://github.com/${owner}/${repo}/stargazers`} target="_blank">{count}</Button>
        </ButtonGroup>
    )
}

const Follow = ({owner, ...otherProps}) => {
    const [count, setCount] = useState(0)

    useEffect(() => {
        fetch(`https://api.github.com/users/${owner}`)
            .then((res) => res.json()).then((res) => {
            setCount(res.followers);
        })
    }, [])

    return (
        <ButtonGroup size="sm" {...otherProps}>
            <Button tag="a" href={`https://github.com/${owner}`} target="_blank">
                <img src="/static/img/github.svg" className="img-xs"/>
                <span>Follow @{owner}</span>
            </Button>
            <Button tag="a" href={`https://github.com/${owner}/followers`} target="_blank">{count}</Button>
        </ButtonGroup>
    )
}

export {Star, Follow}
export default {Star, Follow}