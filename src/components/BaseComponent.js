import {Component} from 'react'


export default class BaseComponent extends Component {
    constructor(props) {
        super(props);
        this.dimension = this.props.dimension;
        this.group = this.props.group;
        this.state = {
            active: false
        };
    }

}