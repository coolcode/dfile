import React , { Component } from 'react';

export default class Image extends Component {
    render(){
        return (
            <image {...this.props} xlinkHref={this.props.href}>
                {this.props.children}
            </image>);
    }
}