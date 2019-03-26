module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        //   underscored: true,
        autoIncrement: true,
        primaryKey: true,
        comment: "Unique ID for de User"
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "User name"
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      updated_at: DataTypes.DATE,
      deleted_at: DataTypes.DATE
    },
    {
      tableName: "user",
      schema: "notes"
    }
  );

  User.associate = function(models) {
    models.User.hasMany(models.UserAuthProvider);
  };

  return User;
};
