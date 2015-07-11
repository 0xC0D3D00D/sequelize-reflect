'use strict';

var Promise = require("bluebird"),
    Sequelize = require("sequelize");

var SequelizeReflect = function(sequelize) {
    this.sequelize = sequelize;
    this.queryInterface = sequelize.getQueryInterface();
};

SequelizeReflect.prototype.createTableFromDatabase = function(tableName) {
    var that = this;

    var resolver = function (resolve, reject) {
        that.queryInterface.describeTable(tableName, {}).then(function(fields) {
        for (var field in fields) {
            if (fields.hasOwnProperty(field)) {
            // delete and skip pgsql special attribute
                if (field === "id") {
                    fields[field].primaryKey = true;
                    fields[field].autoIncrement = true;
                }
                else if (field === "special") {
                    delete fields.special;
                    continue;
                }
                var type = fields[field].type;
                var length = type.match(/\(\d+\)/);

                if (type === "TINYINT(1)" || type === "BOOLEAN") {
                    fields[field].type = Sequelize.BOOLEAN;
                } else if (type.match(/^(SMALLINT|MEDIUMINT|TINYINT|INT)/)) {
                    fields[field].type = (!!length ? Sequelize.INTEGER(length) : Sequelize.INTEGER);
                } else if (type.match(/^BIGINT/)) {
                    fields[field].type = Sequelize.BIGINT;
                } else if (type.match(/^STRING|VARCHAR|VARYING|NVARCHAR/)) {
                    fields[field].type = Sequelize.STRING;
                } else if (type.match(/TEXT|NTEXT$/)) {
                    fields[field].type = Sequelize.TEXT;
                } else if (type.match(/^(DATE|TIME)/)) {
                    fields[field].type = Sequelize.DATE;
                } else if (type.match(/^(FLOAT|DECIMAL)/)) {
                    fields[field].type = eval('Sequelize.' + type.toUpperCase());
                } 
            }
        }

        resolve(that.sequelize.define(tableName, fields, {timestamps:false}));
    }).catch(function(error) {
        reject(error);
    });
    };
    return new Promise(resolver);
};

module.exports = SequelizeReflect;
