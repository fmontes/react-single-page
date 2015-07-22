import Constants  from '../constants/AppConstans'
import Dispatcher from '../dispatcher/AppDispatcher'

export default {
    create(credentials) {
        Dispatcher.dispatch({
            actionType: Constants.USER_CREATE,
            credentials: credentials
        });
    },

    login(credentials) {
        Dispatcher.dispatch({
            actionType: Constants.USER_LOGIN,
            credentials: credentials
        });
    },

    logout() {
        Dispatcher.dispatch({
            actionType: Constants.USER_LOGOUT
        });
    }
}
