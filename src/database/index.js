import Sequelize from 'sequelize';
import Client from '../app/models/Client';

import User from '../app/models/User';

import databaseConfig from '../config/database';

const models = [User, Client];

class Database {
    constructor(){
        this.init();
    }

    init() {
        this.connection = new Sequelize(databaseConfig);

        models.map(model => model.init(this.connection));
    }
}

export default new Database();