exports.handler = async (event, context, callback) => {
    const operation = event.httpMethod;
    switch (operation) {
        case 'GET':
            let data = {
                'id': 1,
                'name': 'changhee'
            }
            callback(null, {
                'statusCode': 200,
                'headers': {'Access-Control-Allow-Origin': '*'},
                'body': JSON.stringify(data)
            });
            break;
        case 'POST':
            callback(null, {
                'statusCode': 200
            });
            break;
        default:
            callback(new Error(`Operation Error "${operation}"`))
    }
};