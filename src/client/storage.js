'use strict';

function mkStorage(storage) {
  return {
    setItem: function(key, value) {
      try {
        storage.setItem(key, JSON.stringify(value));
      } catch (e) {
      }
    },
    getItem: function(key, defaultValue) {
      try {
        var json = storage.getItem(key);
        if (json !== undefined) {
          return JSON.parse(json);
        }
      } catch (e) {
      }
      return defaultValue;
    }
  };
}

module.exports = {
  local: mkStorage(window.localStorage),
  session: mkStorage(window.sessionStorage)
};
