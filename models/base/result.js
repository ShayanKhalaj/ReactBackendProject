class Result{
    name=''
    date=new Date()
    documentId=''
    success=false
    status=100
    message=''
    constructor(name=''){
        if(typeof name !== typeof 'string'){
            throw new Error('name must be string')
        }
        if(name.length===0){
            throw new Error('enter the operation name')
        }
        this.name=name
        this.date=new Date()
    }
    succeeded(message=undefined,documentId=undefined,status=undefined){
        this.success=true
        if(typeof message === typeof 'string') this.message=message
        if(typeof documentId === typeof 'string' && documentId.length>0) this.documentId=documentId
        if(typeof status===typeof 0) this.status=status
        return this
    }
    failed(message=undefined,documentId=undefined,status=undefined){
        this.success=false
        if(typeof message === typeof 'string') this.message=message
        if(typeof documentId === typeof 'string' && documentId.length>0) this.documentId=documentId
        if(typeof status===typeof 0) this.status=status
        return this
    }
}

export default Result