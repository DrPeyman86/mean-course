const Sequelize = require('sequelize');
const PostModel = require('../models/postsSql')

const sequelize = new Sequelize('sandbox', 'sa', 'C0ldFu$ion', {
  host: 'Peyman-PC',
  dialect: 'mssql'
});

const Posts = PostModel(sequelize, Sequelize);


sequelize.sync()
.then(()=>{
  console.log('posts do and table have been created');
})

module.exports = Posts

// module.exports = {Sequelize: Sequelize, sequelize: sequelize} ;
