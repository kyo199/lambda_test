const mongoose = require('mongoose');
const MONGODB_URI = process.env.MONGODB_URI;

exports.handler = async (event, context, callback) => {
    /* Database 설정 및  변수 초기화 */
    mongoose.Promise = global.Promise;
    mongoose.connect(MONGODB_URI, { userNewUrlParser: true });
    const db = mongoose.connection;
    db.once('open', function() {
        console.log('Database Connected.');
    });
};
