import Constants  from '../constants/AppConstans';
import Dispatcher from '../dispatcher/AppDispatcher';

export default {
    load() {
        Dispatcher.dispatch({
            actionType: Constants.REPORT_LOAD
        });
    }
}
