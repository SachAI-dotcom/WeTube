class apiError extends error{
    constructor(statusCode,message="Something went wrong",errors=[],stack=""){
        this.error = error;
        this.message = message;
        this.data=null,
        this.success=false,
        this.errors = errors
        if(stack){
            this.stack = stack;
        }else{
            Error.captureStackTrace(this,this.constructor);
        }
    }
    

}
export default { apiError };