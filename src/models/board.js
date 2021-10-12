export default (sequelize, DataTypes) => {
    // 보드 모델 정의
    const Board = sequelize.define("board", {
        title: {
            type: DataTypes.STRING,
            allowNull: false 
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    });

    Board.associate = function(models) {
        models.Board.belongsTo(models.User);
    }

    return Board; 
};
