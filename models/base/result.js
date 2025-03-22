class Result {
    constructor(action) {
        this.action = action;
        this.message = "";
        this.data = null;
        this.statusCode = null;
    }

    succeeded(message, data, statusCode = 200) {
        this.message = message;
        this.data = data;
        this.statusCode = statusCode;
        return this;
    }

    failed(message, data, statusCode = 500) {
        this.message = message;
        this.data = data;
        this.statusCode = statusCode;
        return this;
    }
}
export default Result