import React from 'react'
import BaseComponent from './BaseComponent';

export default class TitleComponent extends BaseComponent {

    render() {

        return (
            <span key={new Date().getTime()} style={{
                float: "right",
                position: "relative",
                left: "-50%", /* or right 50% */
                textAlign: "left"
            }}>
            </span>

        )
    }
}

// {changeCase.sentenceCase([...new Set(indices)][this.dimension])}