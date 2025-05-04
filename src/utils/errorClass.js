export class ErrorClass extends Error{

    constructor(message,cause){
        super(message)
        this.cause=cause || 500
    }
}

