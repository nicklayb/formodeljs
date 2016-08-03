/* global Formodel */
Formodel.prototype._handleUpdate = function(context, response) {
    context.handleUpdate(context, response);
    if(context.clearAfterUpdate) {
        context.clear();
    }
};

Formodel.prototype._handleStore = function(context, response) {
    context.handleStore(context, response);
    if(context.clearAfterStore) {
        context.clear();
    }
};

Formodel.prototype._handleNew = function(context) {
    context.setErrors(context);
    context.handleNew(context);
};

Formodel.prototype._handleDelete = function(context, response) {
    context.handleDelete(context, response);
    context.clear();
};

Formodel.prototype._handleGet = function(context, response) {
    context.fillWith(response);
    context.handleGet(context, response);
};

Formodel.prototype._handleError = function(context, response) {
    if(context.getErrorList() != null && response.status == context.errorListCode) {
        context.setErrors(context, response.responseJSON);
    }
    context.handleError(context, response);
};

Formodel.prototype._handleBeforeSend = function(context) {
    context.setErrors(context);
    context.handleBeforeSend(context);
};
