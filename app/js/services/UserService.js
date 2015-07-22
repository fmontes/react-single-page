import Config from './../config/index.js';
import request  from 'superagent-es6-promise';
import UserService from './UserService';
import UserStore from '../flux/stores/UserStore';

export default {
    create(credentials) {
        return request
            .post('/api/user')
            .send({ email: credentials.email, password: credentials.password, name: credentials.name })
            .set('X-User-Id', Config.xUserId)
            .promise();
    },

    createConfigId() {
        return request
            .post('/api/config')
            .send({ cookie: UserStore.getUserInformation().token })
            .set('X-User-Id', Config.xUserId)
            .promise();
    },

    // TODO remove this: Utility for dev
    deleteAllUsers() {
        request
            .get('/api/users')
            .set('X-User-Id', Config.xUserId)
            .then(function(res) {
                console.log('USERS TO REMOVE')
                console.log(res);
                var users = res.body;
                for (var i = 0; i < users.length; i++) {
                    if (users[i].email != 'admin@torbit.com') {
                        console.log('REMOVING: '+ users[i].email);
                        request
                            .del('/api/user')
                            .query({ email: users[i].email })
                            .set('X-User-Id', Config.xUserId)
                            .then(function(res) {
                                console.log('DELETED');
                                console.log(res);
                            })
                    }

                }
            })
    },

    // TODO remove this: Utility for dev
    deleteConfigs() {
        request
            .get('/api/configs')
            .set('X-User-Id', Config.xUserId)
            .then(function(res) {
                console.log('CONFIGS TO REMOVE')
                console.log(res);
                var configs = res.body;
                for (var i = 0; i < configs.length; i++) {
                    console.log('REMOVING: '+ configs[i].email);
                    request
                        .del('/api/config')
                        .query({ id: configs[i].id })
                        .set('X-User-Id', Config.xUserId)
                        .then(function(res) {
                            console.log('DELETED');
                            console.log(res);
                        })

                }
            })
    },

    login(credentials) {
        return request
            .post('/api/login')
            .query({ email: credentials.email, password: credentials.password })
            .set('X-User-Id', Config.xUserId)
            .promise();
    }
}
