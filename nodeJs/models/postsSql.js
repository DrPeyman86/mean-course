//const {Sequelize,sequelize} = require('../Database/sequelize');


module.exports = (sequelize, type)=>{
  return sequelize.define('posts', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: Sequelize.STRING,
    content: Sequelize.STRING
  }, {
    timestamps: false
  })
}
//const Posts = PostsModel(sequelize, Sequelize);

// sequelize.sync()
// .then(()=>{
//   console.log('posts do and table have been created');
// })


// module.exports = {Posts: Posts};
