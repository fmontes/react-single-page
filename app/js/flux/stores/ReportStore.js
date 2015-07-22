import Constants from '../constants/AppConstans';
import Dispatcher from '../dispatcher/AppDispatcher';
import ReportService from '../../services/ReportService';
import UserActions from '../actions/UserActions';
import { EventEmitter } from 'events';

let CHANGE_EVENT = "change";

class ReportStore extends EventEmitter {
    constructor() {
        super();
    }

    addChangeListener(callback) {
        this.on(CHANGE_EVENT, callback);
    }

    emitChange() {
        this.emit(CHANGE_EVENT);
    }

    fetch() {
        var that = this;
        return new Promise(function(resolve, reject) {
            ReportService.get()
                .then(function(res) {
                    var data = res.body.data;
                    that.setData(data);
                    resolve(ReportService.parseData(data));

                }, function(error) {
                    if (error.status === 401) {
                        UserActions.logout();
                    }
                    reject(res);
                });
        })
    }

    getData() {
        return this.data;
    }

    removeChangeListener(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }

    setData(data) {
        this.data = ReportService.parseData(data);
    }
}

let Store = new ReportStore();

Dispatcher.register(action => {

    switch (action.actionType) {

        case Constants.REPORT_LOAD:
            ReportService.get()
                .then(function(res) {
                    Store.setData(JSON.parse(res.text).data);
                    Store.emitChange();
                }, function(error) {
                    if (error.status === 401) {
                        // TODO: alert the user that session expired
                        UserActions.logout();
                    }
                    Store.emitChange();
                });
            break;

        default:
        // no op
    }

});

export default Store;
