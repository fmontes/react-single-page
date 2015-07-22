import Constants from '../constants/AppConstans';
import Dispatcher from '../dispatcher/AppDispatcher';
import SiteConfigActions from '../actions/SiteConfigActions';
import SiteConfigService from '../../services/SiteConfigService';
import UserActions from '../actions/UserActions';
import UserStore from '../stores/UserStore';
import { EventEmitter } from 'events';

let CHANGE_EVENT = 'change';

class ReportStore extends EventEmitter {
    constructor() {
        super();
        this.config = {};
    }

    addChangeListener(callback) {
        this.on(CHANGE_EVENT, callback);
    }

    emitChange(res) {
        res = res || {};
        this.emit(CHANGE_EVENT, res);
    }

    fetch() {
        var that = this;
        return new Promise(function(resolve, reject) {
            SiteConfigService.get()
                .then(function(res) {
                    if (!res.body.redirects) {
                        res.body.redirects = {};
                    }
                    if (!res.body.rewriterule) {
                        res.body.rewriterule = {};
                    }
                    if (!res.body.scripts) {
                        res.body.scripts = [];
                    }
                    that.set(res.body);
                    resolve(res);
                }, function(error) {
                    if (error.status === 401) {
                        UserActions.logout();
                    }
                    reject(error);
                });
        });
    }

    get() {
        return this.config;
    }

    set(data) {
        this.config = data;
    }

    removeChangeListener(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }
}

let Store = new ReportStore();

Dispatcher.register(action => {

    switch (action.actionType) {

        case Constants.CONFIG_SAVE:
            Store.set(action.data);
            SiteConfigService.put(action.data)
                .then(function(res) {
                    Store.emitChange(res);
                }, function(error) {
                    console.log(error);
                    Store.emitChange(res);
                });
            break;

        default:
        // no op
    }

});

export default Store;
