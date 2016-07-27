Formodel.prototype._handleUpdate = function(context, response){
    if(context.clearAfterUpdate){
        context.new();
    }
    context.handleUpdate(context, response);
};

Formodel.prototype._handleStore = function(context, response){
    if(context.clearAfterStore){
        context.new();
    }
    context.handleStore(context, response);
};

Formodel.prototype._handleDelete = function(context, response){
    context.new();
    context.handleDelete(context, response);
};

Formodel.prototype._handleGet = function (context, response) {
    context.fillWith(response);
    context.handleGet(context, response);
};
