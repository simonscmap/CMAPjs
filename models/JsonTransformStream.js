const Transform = require('stream').Transform

// Class for a transform stream which converts database responses to
// stringified json. Constructor accepts a responses object and adds
// handlers and pipe.
module.exports = class JsonTransformStream extends Transform{
    constructor(res){
        super({objectMode : true});
        this.on('error', err => res.status(500).json(err));
        this.once('end', () => {
            res.status(200).end()
        });
        this.pipe(res);
    }

    _transform(chunk, encoding, done) {
        this.push(JSON.stringify(chunk));
        done();
    }
}
