## promise.js
```js
const RESOLVED='RESOLVED';
const REJECTED='REJECTED';
const PENNING='PENDING';
console.log('my')
class Promise{
    constructor(executor){
        this.status=PENNING;
        this.value=undefined;
        this.reason=undefined;
        let resolve=(value)=>{
            if(this.status===PENNING){
                this.value=value;
                this.status=RESOLVED
            }
        }
        let reject=(reason)=>{
            this.reason=reason
            this.status=REJECTED;
        }
        try{
            executor(resolve,reject);
        }catch(e){
            console.log(e)
            reject(e)
        }
    }
    then(onFulfilled,onRejected){
        if(this.status===RESOLVED){
            onFulfilled();
        }
        if(this.status==REJECTED){
            onRejected(this.reason)
        }
    }
}

module.exports=Promise
```
## test.js
```js
let Promise=require('./promise')
let promise=new Promise((resolve,reject)=>{
    throw new Error('失败了')
    resolve('成功')
    reject('失败')
})
promise.then((data)=>{
    console.log('success',data)
},(err)=>{
    console.log('failed',err)
})
```