"use strict";
const SHA256 = require('crypto-js/sha256');
//https://github.com/SavjeeTutorials/SavjeeCoin
class Block{
    constructor (index, timestamp, data){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = '';

        this.hash = this.calculateHash();
        this.nonce = 0;

    }

    calculateHash(){
        var _hash = SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
        return _hash;
    }
    //why mine/ make it take time
    //dont want people to create 100/1000s per second and spam the block chain
    //security : change contents of a block and then simply recalculate the hashes for all the blocks after and then have a valid chain even though tampered
    //therefore proof of work - this mechanim makes you have to put alot of computer power into creating a block
    //e.g. block chain requires the hashed block to start with a certain number of zeros and since you cannot inlfuence the output of a hash function you 
    //have to try lots of combinations to get a hash with a sufficent number of zeros - difficulty. aim of bitcoin 1 new block per 10mins, so as computer power goes up
    //diffuicilty increases
    mineBlock(difficulty){
        //while the hash does not have a string of 0s of length diffculty at the front
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
            //nonce value used to change the hash
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("Block mined: " + this.hash);
    }
}

class Blockchain {

    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 5;
    }

    //first block is created manually
    createGenesisBlock(){
        return new Block(0,"01/01/2017","Gensis block", "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        //newBlock.hash = newBlock.calculateHash();
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    isChainValid(){
        //ignore genesis block
        for(let i = 1; i < this.chain.length; i ++){
            const currentBlock  = this.chain[i];
            const previousBlock = this.chain[i-1];

            //is the current has correct
            if(currentBlock.hash !== currentBlock.calculateHash())
            {
                return false;
            }
            //does the current hash's prev hash match the prev hash
            if(currentBlock.previousHash !== previousBlock.hash)
            {
                return false;
            }
            
        }

        return true;
    }
}

let sharpeCoin = new Blockchain();
console.log('Mining Block 1....');
sharpeCoin.addBlock(new Block(1, "20/10/2018", {amount:4}));
console.log('Mining Block 2....');
sharpeCoin.addBlock(new Block(2, "22/10/2018", {amount:10}));


/*console.log('Is Blockchain valid? ' + sharpeCoin.isChainValid());

sharpeCoin.chain[1].data = {amount : 100};
sharpeCoin.chain[1].hash = sharpeCoin.chain[1].calculateHash();

console.log('Is Blockchain valid? ' + sharpeCoin.isChainValid());
//console.log(JSON.stringify(sharpeCoin, null, 4));*/