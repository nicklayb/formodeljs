Formodel.prototype._handleUpdate = function(context, response){
    context.handleUpdate(context, response);
    if(context.clearAfterUpdate){
        context.new();
    }
};

Formodel.prototype._handleStore = function(context, response){
    context.handleStore(context, response);
    if(context.clearAfterStore){
        context.new();
    }
};

Formodel.prototype._handleDelete = function(context, response){
    context.handleDelete(context, response);
        context.new();
};

Formodel.prototype._handleGet = function (context, response) {
    context.fillWith(response);
    context.handleGet(context, response);
};
