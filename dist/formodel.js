function Formodel(options){
    this.form = options.form;
    this.model = options.model || this.getForm().attr('data-model');
    this.errorListCode = options.errorListCode || 422,
    this.attributes = options.attributes;
    this.rootUrl = options.rootUrl || '';
    this.tokenKey = options.tokenKey || '_token';
    this.token = options.token || '';
    this.idKey = options.idKey || null;
    this.errorList = options.errorList || null;
    this.appendError = options.appendError || this._appendError;
    this.handleUpdate = options.handleUpdate || function(){};
    this.handleStore = options.handleStore || function(){};
    this.handleDelete = options.handleDelete || function(){};
    this.handleGet = options.handleGet || function(){};
    this.handleNew = options.handleNew || function(){};
    this.handleError = options.handleError || function(){};
    this.handleBeforeSend = options.handleBeforeSend || function(){};
    this.handleSuccess = options.handleSuccess || function(){};
    this.targetBefore = options.targetBefore || function(){};
    this.targetAfter = options.targetAfter || function(){};
    this.clearAfterStore = options.clearAfterStore || true;
    this.clearAfterUpdate = options.clearAfterUpdate || true;
    this.usingTemplates = options.usingTemplates || true;
    this.recordId = -1;
    this.target = null;
    this.targetOriginal = null;
    this._init();
}

Formodel.templates = {
    loading:'<i class="fa fa-spinner faa-spin animated"></i>',
    success:'<i class="fa fa-eye"></i>',
    error:'<i class="fa fa-exclamation-triangle"></i>'
};

Formodel.prototype.clear = function(){
    var attributes = this.getAttributes();
    for(var key in attributes){
        this.fillInput(attributes[key], key, '');
    }
};

Formodel.prototype.get = function (id, target) {
    this.setTarget(target);
    this.setRecordId(id);
    var data = this.getAjaxData(),
        url = this.getUrl(this.getRecordId());
    this._ajax(url, 'GET', data, this._handleGet);
};

Formodel.prototype.new = function () {
    this.setRecordId(-1);
    this.clear();
    this._handleNew(this);
};

Formodel.prototype.destroy = function (target) {
    this.setTarget(target);
    if(this.getRecordId() > -1){
        var url = this.getUrl(this.getRecordId()),
            data = this.getFormData();
        this._ajax(url, 'DELETE', data, this._handleDelete);
    }
};

Formodel.prototype.save = function(target) {
    this.setTarget(target);
    if(this.getRecordId() > 0){
        this._update();
    } else {
        this._store();
    }
};



Formodel.prototype._ajax = function(url, type, data, handler) {
    var context = this;
    data = this.getAjaxData(data);
    $.ajax({
        url:url,
        type:type,
        data:data,
        beforeSend:function(){
            context._handleBeforeSend(context);
            context._targetBefore();
            if(context.usingTemplates){
                context._setTargetTemplate('loading');
            }
        },
        success:function(response){
            context._targetAfter(true, response);
            context.handleSuccess(context, response);
            if(context.usingTemplates){
                context._setTargetTemplate(null);
            }
            handler(context, response);
        },
        error:function(response){
            context._targetAfter(false, response);
            context._handleError(context, response);
            if(context.usingTemplates){
                context._setTargetTemplate('error');
            }
        },
    });
};

Formodel.prototype._init = function() {
    var context = this;
    this.getForm().submit(function(e){
        e.preventDefault();
        context.save($(this).find('button[type="submit"]'));
    });
}

Formodel.prototype._update = function() {
    var url = this.getUrl(this.getRecordId()),
        data = this.getFormData();
    this._ajax(url, 'PUT', data, this._handleUpdate);
};

Formodel.prototype._store = function() {
    var url = this.getUrl(),
        data = this.getFormData();
    this._ajax(url, 'POST', data, this._handleStore);
};

Formodel.prototype._setTargetTemplate = function(template) {
    if(this.target !== null && this.target !== undefined){
        if(template !== undefined && template !== null){
            if($(this.target).attr('data-original') == null || $(this.target).attr('data-original') == '' || $(this.target).attr('data-original') === undefined ){
                $(this.target).attr('data-original', $(this.target).html());
            }
            $(this.target).html(Formodel.templates[template]);
        } else {
            $(this.target).html($(this.target).attr('data-original'));
        }
    }
}

Formodel.prototype.setTarget = function (target) {
    if(target === undefined || target == null || target == ''){
        target = null
    }
    this.target = target;
};

Formodel.prototype._targetAfter = function(success, response) {
    this.targetAfter(this.target, success, response);
}

Formodel.prototype._targetBefore = function() {
    this.targetBefore(this.target);
}

Formodel.prototype._appendError = function (error) {
    return '<li>' + error + '</li>';
};

Formodel.prototype.getInputValue = function (tag, name) {
    switch (tag.toLowerCase()) {
        case 'checkbox':
            var selector = 'input[type="' + tag + '"][name="' + name + '"]';
            return this.getForm().find(selector).prop('checked');
        case 'radio':
            var selector = 'input[type="' + tag + '"][name="' + name + '"]';
            return this.getForm().find(selector).val();
            break;
        default:
            var selector = tag + '[name="' + name + '"]';
            return this.getForm().find(selector).val().trim();
    }
};

Formodel.prototype.getErrorList = function () {
    return (this.errorList != null) ? $('#' + this.errorList) : null;
};

Formodel.prototype.getFormData = function (idKey) {
    var data = {},
        attributes = this.getAttributes(),
        idKey = (this.idKey !== undefined && this.idKey != null) ? this.idKey : idKey;
    for(var key in attributes){
        var value = this.getInputValue(attributes[key], key);
        data[key] = value || null;
    }
    if(idKey !== undefined){
        data[idKey] = this.getRecordId();
    }
    this.requestData = data;
    return this.requestData;
};

Formodel.prototype.getForm = function () {
    return $('#' + this.form);
};

Formodel.prototype.getAttributes = function (key) {
    return (key !== undefined) ? this.attributes[key] : this.attributes;
};

Formodel.prototype.getUrl = function (id) {
    id = (id !== undefined) ? ('/' + id) : '';
    return this.getRootUrl() + '/' + this.getModel() + id;
};

Formodel.prototype.getRootUrl = function() {
    var chop = (this.rootUrl.charAt(this.rootUrl.length-1) == '/') ? 1 : 0;
    return this.rootUrl.slice(0, this.rootUrl.length-chop);
}

Formodel.prototype.getModel = function () {
    return this.model;
};

Formodel.prototype.getAjaxData = function (datas) {
    var datas = datas || {};
    datas[this.tokenKey] = this.token;
    return datas;
}

Formodel.prototype.getRequestData = function () {
    return this.requestData;
};

Formodel.prototype.getRecordId = function () {
    return parseInt(this.recordId);
};

Formodel.prototype._handleUpdate = function(context, response){
    context.handleUpdate(context, response);
    if(context.clearAfterUpdate){
        context.clear();
    }
};

Formodel.prototype._handleStore = function(context, response){
    context.handleStore(context, response);
    if(context.clearAfterStore){
        context.clear();
    }
};

Formodel.prototype._handleNew = function (context) {
    context.setErrors(context);
    context.handleNew(context);
};

Formodel.prototype._handleDelete = function(context, response){
    context.handleDelete(context, response);
    context.clear();
};

Formodel.prototype._handleGet = function (context, response) {
    context.fillWith(response);
    context.handleGet(context, response);
};

Formodel.prototype._handleError = function (context, response) {
    if(context.errorList != null && response.status == context.errorListCode){
        context.setErrors(context, response.responseJSON);
    }
    context.handleError(context, response);
};

Formodel.prototype._handleBeforeSend = function (context) {
    context.setErrors(context);
    context.handleBeforeSend(context);
};

Formodel.prototype.setRecordId = function (id) {
    id = parseInt(id);
    this.recordId = (id !== undefined && id !== null && id > -1 && !isNaN(id)) ? id : -1;
};

Formodel.prototype.fillInput = function (tag, name, value) {
    switch (tag.toLowerCase()) {
        case 'checkbox':
        case 'radio':
            var selector = 'input[type="' + tag + '"][name="' + name + '"]';
            this.getForm().find(selector).prop('checked', value).change();
            break;
        default:
            value = (typeof value == 'string') ? value.trim() : value;
            var selector = tag + '[name="' + name + '"]';
            this.getForm().find(selector).val(value);
    }
};

Formodel.prototype.setErrors = function (context, errors) {
    var list = context.getErrorList();
    list.html('');
    if(errors !== undefined){
        $.each(errors, function(i, v){
            list.append(context.appendError(v[0]));
        });
        list.slideDown();
    }
    else{
        list.hide();
    }
};

Formodel.prototype.fillWith = function (record) {
    var attributes = this.getAttributes();
    for(var key in attributes){
        this.fillInput(attributes[key], key, record[key]);
    }
};
