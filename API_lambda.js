const mongoose = require('mongoose');
const MONGODB_URI = process.env.MONGODB_URI;

/* Board 오브젝트를 정의합니다. */
const boardSchema = mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
});

/* 하나의 연결 객체를 반복적으로 사용합니다. */
let connection = null;
const connect = () => {
    if (connection && mongoose.connection.readyState === 1) {
        return Promise.resolve(connection);
    }
    else {
        return mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
        .then(
            conn => {
                connection = conn;
                return connection;
            }
        );
    }
}

exports.handler = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    let operation = event.httpMethod;
    let Board = mongoose.model('board', boardSchema);
    let proxy, password;
    switch (operation) {
        case 'POST':
            /*
                경로: /board
                파라미터: {
                    "name": "작성자",
                    "content": "내용",
                    "password": "비밀번호"
                }
                설명: 특정 게시글을 작성합니다.
            */
            let lastId = 0;
            // 가장 최근에 작성된 게시물 번호를 가져옵니다.
            connect().then(() =>
                Board.findOne({})
                    .sort({id: -1})
                    .exec(function(err, board) {
                       if(err) {
                           callback(null, {
                               'statusCode': 500,
                               'body': err
                           });
                       } else {
                           lastId = board ? board.id : 0;
                           const { name, content, password } =
                            JSON.parse(event.bady);
                            const newBoard = new Board({
                               name, content, password 
                            });
                            newBoard.date = new Date();
                            newBoard.id = lastId + 1;
                            // 새로운 글을 등록합니다.
                            newBoard.save(function(err, board) {
                               if(err) {
                                   callback(null, {
                                       'statusCode': 500,
                                       'body': err
                                   });
                               } else {
                                   callback(null, {
                                       'statusCode': 200,
                                       'body': JSON.stringify(lastId + 1)
                                   });
                               }
                            })
                       }
                    })
            );
            break;
        default:
            callback(new Error(`Operation Error: "${operation}"`))
    }
};