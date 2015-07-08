# Sequelize-Reflect

Automatically generate models for [SequelizeJS](https://github.com/sequelize/sequelize) in runtime.

## Install

    npm install -g sequelize-reflect

## Usage and Example

    var sequelizeReflect = new SequelizeReflect(sequelize);

    sequelizeReflect.createTableFromDatabase('Bars').then(function(model) {
        // do your stuff with the model generated
        model.findAll().then(function(data) {
        });
    });

Which makes it easy for you to simply make [queries](http://docs.sequelizejs.com/en/latest/docs/querying/) on it.
