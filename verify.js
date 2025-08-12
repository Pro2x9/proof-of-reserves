const { MerkleTree } = require('merkletreejs');
const SHA256 = require('crypto-js/sha256');

var fs = require('fs'),
    readline = require('readline');

const [_,f,path,checkHash] = process.argv

console.log('file path is', path)
console.log('check merkle leaf is', checkHash)
var rd = readline.createInterface({
    input: fs.createReadStream(path),
    output: process.stdout,
    console: false,
    terminal: false
});

const leaves = []
let options = {
    hashLeaves: false,
};

function bufferToString(value) {
	return value.toString('hex');
}


var is_matched = '0';
rd.on('line', function(line) {
    if(!line || line === "Level\tHash" || line[0] ==='#'){
        return
    }
    let [pos,hash] = line.match(/[^\s]+/g)
    if(checkHash === hash){
        console.log('Successful! Found your information in the Merkle Tree at Level and position: ' + pos);
        is_matched='1';
    }
    leaves.push(hash)
}
);

rd.on('close', function() {
    if(is_matched === '0'){
     console.log('Could not find your information in the Merkle Tree.');
     }
    console.log('Merkle root hash is being generated ...');
    const tree = new MerkleTree(leaves, SHA256, options);
    const root = bufferToString(tree.getRoot());
    console.log('Merkle root hash:' + root);
    console.log('Finshed');
});


