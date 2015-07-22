import React from 'react';
import UserActions from '../flux/actions/UserActions';
import UserStore from '../flux/stores/UserStore';
import { Link } from 'react-router';


export default class Header extends React.Component {
    constructor(props)  {
        super(props);
    }

    logout() {
        UserActions.logout();
    }

    getClass(path) {
        var { router } = this.context;
        return router.isActive(path) ? 'active': '';
    }

    render() {
        var MenuItems;
        if (UserStore.isUserLoggedIn()) {
            MenuItems =  <ul className="nav navbar-nav">
                            <li className={this.getClass('/')}><Link activeClassName="" to="/">Dashboard</Link></li>
                            <li className="dropdown">
                                <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">{UserStore.getUserInformation().userName}<span className="caret"></span></a>
                                <ul className="dropdown-menu">
                                    <li className={this.getClass('/config')}><Link activeClassName="" to="/config">Site Configurations</Link></li>
                                    <li><Link activeClassName="" to="/login" onClick={this.logout}>Logout</Link></li>
                                </ul>
                            </li>
                        </ul>
        } else {
            MenuItems =  <ul className="nav navbar-nav">
                            <li className={this.getClass('/login')}><Link activeClassName="" to="/login">Login</Link></li>
                            <li className={this.getClass('/create')}><Link activeClassName="" to="/create">Create Account</Link></li>
                        </ul>
        }
        return (
            <div id="navbar" className="navbar-collapse collapse navbar-right">
                {MenuItems}
            </div>
        )
    }
}

// TODO: WORKAROUND fix on the way: https://github.com/react-bootstrap/react-router-bootstrap/issues/91
Header.contextTypes = {
    router: function() { return React.PropTypes.func.isRequired; }
};
