const Transform = require('stream').Transform

// Class for a transform stream which converts database responses to
// stringified json. Constructor accepts a responses object and adds
// handlers and pipe.
module.exports = class JsonTransformStream extends Transform{
    constructor(res){
        super({objectMode : true});
        this.buffer = [];

        // In cases where we want to finish streaming before continuing
        // we can await this promise. The event listeners work the same
        // either way.
        this.awaitableStreamEnd = new Promise((resolve, reject) => {
            this.on('error', err => {
                res.end(JSON.stringify(err));
                reject();
            });

            this.once('end', () => {
                res.end();
                resolve();
            })
        })
       
        this.pipe(res);

        res.writeHead(200, {
            'Content-Type': 'application/json',
            'Transfer-Encoding': 'chunked'
        })
    }

    _transform(chunk, encoding, done) {
        if(this.buffer.length >= 20){
            this.push(JSON.stringify(this.buffer));
            this.buffer = [];
        }
        this.buffer.push(chunk);
        done();
    }

    _flush(done){
        this.push(JSON.stringify(this.buffer));
        done();
    }
}
