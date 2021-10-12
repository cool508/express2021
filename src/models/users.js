export default (sequelize, DataTypes) => {
    // 유저 모델 정의
    const User = sequelize.define("user", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        age: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true
        }
    });

    User.associate = function(models) {
        models.User.hasMany(models.Board);
    }

    return User; 
};