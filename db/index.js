const {Sequelize} = require("sequelize");

const sequelizeInstance = new Sequelize({
    dialect: "sqlite",
    storage: "./sqliteData/database.sqlite",//путь до файла с данными
});

const initDB = async () => {
    try {
        await sequelizeInstance.authenticate();//авторизация ORM в БД
        await sequelizeInstance.sync();//синхронизация моделей
        console.log("Sequelize was initialized");
    } catch (error){
        console.log("Sequelize ERROR (initDB)", error);
        process.exit();
    }
};

module.exports = {
    sequelizeInstance,
    initDB,
};