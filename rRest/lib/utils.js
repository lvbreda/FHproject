exports.cleanObject = function (object) {
    var temp = object;
    for (var key in temp) {
        if (key == "_id" || key.indexOf("$") > -1) {
            delete temp[key];
        }
    }
    return temp;
}