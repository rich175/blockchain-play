//--------------------------------
//MULTIPLE TRANSACTIONS
//--------------------------------


"use strict";
const SHA256 = require('crypto-js/sha256');
//https://github.com/SavjeeTutorials/SavjeeCoin


class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}


class Block{
    constructor (timestamp, transactions){
        this.transactions = transactions;
        this.timestamp = timestamp;        
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
        this.difficulty = 2;
        //transactions waiting to be mined
        this.pendingTransactions = [];
        //reward given on the mining of a block
        this.miningReward = 100;
    }

    //first block is created manually
    createGenesisBlock(){
        return new Block("01/01/2017","Gensis block", "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    //if i successfully mine this block this is the address I want the reward sending to
    minePendingTransactions(miningRewardAddress){
        //in bitocoin the pendingtransactions list is huge so miners get to chose the transactions to mine
        let block = new Block(Date.now(), this.pendingTransactions);
        block.previousHash = this.getLatestBlock().hash;
        block.mineBlock(this.difficulty);

        console.log('Block succesfully mined!');
        this.chain.push(block);
        //this is where you could give yourself more money however in bitcoin this is where the other nodes (P2P network) in the system would ignore your new block
        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
    }

    createTransaction(transaction){
        this.pendingTransactions.push(transaction);
    }

    //the only way to get your balance is to process the transactions in a blockchain
    getBalanceOfAddress(address){
        let balance = 0;
        for (const block of this.chain){
            for (const trans of block.transactions)
            {
                if(trans.fromAddress === address)
                {
                    balance -= trans.amount;
                }
                if (trans.toAddress === address)
                {
                    balance += trans.amount;
                }
            }
        }
        return balance;
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
sharpeCoin.createTransaction(new Transaction('address1', 'address2', 100));
sharpeCoin.createTransaction(new Transaction('address2', 'address1', 50));

console.log('\n Starting the miner');
//will be 0 here has this new transaction of paying hte miner is now in the pending transactions list
sharpeCoin.minePendingTransactions('richards-address');

console.log('\nBalance of rich is ', sharpeCoin.getBalanceOfAddress('richards-address'));

console.log('\n Starting the miner');
sharpeCoin.minePendingTransactions('richards-address');

console.log('\nBalance of rich is ', sharpeCoin.getBalanceOfAddress('richards-address'));