import Config from '../../config/index';
import Constants from '../constants/AppConstans';
import Dispatcher from '../dispatcher/AppDispatcher';
import Parse from 'parse-browserify';
Parse.initialize(Config.parse.appId, Config.parse.jsKey);
import UserService from '../../services/UserService';
import { EventEmitter } from 'events';


let CHANGE_EVENT = 'change';

class UserStore extends EventEmitter {
    constructor() {
        super();
    }

    addChangeListener(callback) {
        this.on(CHANGE_EVENT, callback);
    }

    createConfigId() {
        var that = this;
        return new Promise(function(resolve, reject) {
            var UsersConfig = Parse.Object.extend('UsersConfig');
            var userConfig = new UsersConfig();
            UserService.createConfigId()
                .then(function (res) {
                    userConfig.save({email: that.getUserInformation().userEmail, configId: res.body.id}).then(function (object) {
                        that.setUserInformation(null, null, null, object.get('configId'));
                        resolve(object);
                    });
                }, function (error) {
                    console('Error: ' + error.code + ' ' + error.message);
                    reject(error);
                });
        });
    }

    createUser(credentials) {
        return new Promise(function(resolve, reject) {
            UserService.create(credentials)
                .then(function(res) {
                    // TODO: validate existing user
                    if (res.status === 200) {
                        resolve(res);
                    } else {
                        reject(res);
                    }
                }, function(error) {
                    console.log(error);
                    reject(error);
                });
        })
    }

    emitChange(res) {
        this.emit(CHANGE_EVENT, res);
    }

    getConfigId() {
        var that = this;
        var UsersConfig = Parse.Object.extend('UsersConfig');
        var query = new Parse.Query(UsersConfig);
        return new Promise(function(resolve, reject) {
            query.equalTo('email', that.getUserInformation().userEmail);
            query.find({
                success: function (results) {
                    if (results.length) {
                        that.setUserInformation(null, null, null, results[0].get('configId'));
                        resolve(results)
                    } else {
                        reject(results);
                    }
                },
                error: function (error) {
                    console('Error: ' + error.code + ' ' + error.message);
                    reject(error);
                }
            });
        });
    }

    getUserInformation() {
        return {
            userEmail: localStorage.userEmail,
            userName: localStorage.userName,
            token: localStorage.token,
            configId: localStorage.configId
        }
    }

    isUserLoggedIn() {
        return localStorage.token != undefined && localStorage.userEmail != undefined;
    }

    loginUser(credentials) {
        var that = this;
        return new Promise(function(resolve, reject) {
            UserService.login(credentials)
                .then(function(res) {
                    if (res.status === 200) {
                        that.setUserInformation(res.body.user.name, res.body.user.email, res.body.token);
                        Store.getConfigId()
                            .then(function(res) {
                                console.log(res);
                            }, function(error) {
                                Store.createConfigId()
                                    .then(function(res) {
                                        console.log(res);
                                    }, function(error) {
                                        console.log(error);
                                    })
                            });

                        resolve(res);
                    }
                }, function(error) {
                    console.log(error);
                    reject(error);
                });
        });
    }

    logoutUser() {
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        localStorage.removeItem('configId');
    }

    removeChangeListener(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }

    setUserInformation(userName, userEmail, token, configId) {
        if (userName) localStorage.userName = userName;
        if (userEmail) localStorage.userEmail = userEmail;
        if (token) localStorage.token = token;
        if (configId) localStorage.configId = configId;
    }
}

let Store = new UserStore();

Dispatcher.register(action => {
    switch (action.actionType) {

        case Constants.USER_LOGIN:
            Store.loginUser(action.credentials)
                .then(function(res) {
                    Store.emitChange(res);
                }, function(error) {
                    Store.emitChange(error);
                    console.log(error);
                });
            break;

        case Constants.USER_LOGOUT:
            Store.logoutUser();
            Store.emitChange();
            break;

        case Constants.USER_CREATE:
            // TODO: remove this utility
            //UserService.deleteAllUsers();
            //UserService.deleteConfigs();
            Store.createUser(action.credentials)
                .then(function(res) {
                    Store.loginUser(action.credentials)
                        .then(function(res) {
                            console.log(res);
                            Store.emitChange(res);
                        }, function(error) {
                            console.log(error);
                            Store.emitChange(error);
                        });
                }, function(error) {
                    console.log(error);
                    Store.emitChange(error);
                });
            break;

        default:
        // no op
    }
});

export default Store;
