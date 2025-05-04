export class apiFeatures{
    constructor(mongooseQuery , queryData){
        this.mongooseQuery=mongooseQuery
        this.queryData=queryData
    }

    pagination = ()=>{
        let page =this.queryData.page
        let size = this.queryData.size
        if(page<=0 || !page)page=1
        if(size<=0 || !size)size=5
        const skip = size * (page-1)
        this.mongooseQuery.skip(skip).limit(size)
        return this
    }
}