import NavBar from './NavBar';
import React from 'react';
import UserActions from '../flux/actions/UserActions';
import UserStore from '../flux/stores/UserStore';
import { Link } from 'react-router';

export default class Header extends React.Component {
    constructor(props)  {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <nav className="navbar navbar-inverse navbar-fixed-top">
                <div className="container">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                        <a className="navbar-brand" href="#">Torbit</a>
                    </div>
                    <NavBar />
                </div>
            </nav>
        )
    }
}
