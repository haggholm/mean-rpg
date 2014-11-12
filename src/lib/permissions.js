module.exports = {
  owner: function(user, ob) {
    return user !== null &&
           user !== undefined &&
           ob !== null &&
           ob !== undefined &&
           user._id === ob.user_id;
  }
};
