import CreateAccountForm from './CreateAccountForm';
import Dashboard from './Dashboard';
import LoginForm from './LoginForm';
import Main from './Main';
import notFound from './NotFound';
import React from 'react';
import SiteConfig from './SiteConfig';
import { Router, Route, NotFoundRoute } from 'react-router';

import UserStore from '../flux/stores/UserStore.js';

export default class Root extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            login: UserStore.isUserLoggedIn()
        };
    }

    componentDidMount() {
        UserStore.addChangeListener(this.onChange.bind(this));
    }

    onChange() {
        this.setState({
            login: UserStore.isUserLoggedIn()
        });
    }

    isUserLoggedIn() {
        return this.state.login;
    }

    userStatusCheck(nextState, transition) {
        if (!this.isUserLoggedIn() && nextState.location.pathname === '/' || !this.isUserLoggedIn() && nextState.location.pathname.indexOf('config') > -1) {
            transition.to('/login', null, {nextPathname: nextState.location.pathname});
        }

        if (this.isUserLoggedIn() && nextState.location.pathname.indexOf('login') > -1 ||
            this.isUserLoggedIn() && nextState.location.pathname.indexOf('create') > -1) {
            transition.to('/', null, {nextPathname: nextState.location.pathname});
        }
    }

    render() {
        const { history } = this.props;
        return (
            <Router history={history}>
                <Route component={Main}>
                    <Route name="dashboard" path="/" component={Dashboard} onEnter={this.userStatusCheck.bind(this)} title="Dashboard" />
                    <Route name="login" path="login" component={LoginForm} onEnter={this.userStatusCheck.bind(this)} title="User Login" />
                    <Route name="create" path="create" component={CreateAccountForm} onEnter={this.userStatusCheck.bind(this)} title="Create Account" />
                    <Route name="config" path="config" component={SiteConfig} onEnter={this.userStatusCheck.bind(this)} title="Site Configuration" />
                    <Route name="error" path="*" component={notFound} />
                </Route>
            </Router>
        );
    }
}

