/*
  File for global functions
 */

/**
 *
 * @param object
 *  Object containing _id and $.. aka functions. These can't and may not be saved in any database. (_id can not be overwritten
 * @return {*}
 *  cleaned object
 *
 * todo : Easy way to implement different primary key then _id.
 */
exports.cleanObject = function (object) {
    var temp = object;
    for (var key in temp) {
        if (key == "_id" || key.indexOf("$") > -1) {
            delete temp[key];
        }
    }
    return temp;
}