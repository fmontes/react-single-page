import Constants  from '../constants/AppConstans';
import Dispatcher from '../dispatcher/AppDispatcher';

export default {
    save(data) {
        Dispatcher.dispatch({
            actionType: Constants.CONFIG_SAVE,
            data: data
        });
    }
}
