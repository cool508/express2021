import dotenv from 'dotenv';
import Sequelize from 'sequelize';

import User from './users.js';
import Board from './board.js';

dotenv.config();

const { DATABASE, DATABASE_HOST, USER_NAME, PASSWORD, LOGGING } = process.env;

const sequelize = new Sequelize(DATABASE, USER_NAME, PASSWORD, {
    host: DATABASE_HOST,
    dialect: 'mysql',
    logging: (LOGGING==='true')
});

sequelize.authenticate()
.then(() => {
    console.log("연결 성공");
})
.catch(err => {
    console.log("연결 실패: ", err);
});

const db = {
    User: User(sequelize, Sequelize.DataTypes),
    Board: Board(sequelize, Sequelize.DataTypes),
};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

export default db;