function Formodel(options){
    this.form = options.form;
    this.model = options.model || this.getForm().attr('data-model');
    this.attributes = options.attributes;
    this.rootUrl = options.rootUrl || '';
    this.tokenKey = options.tokenKey || '_token';
    this.token = options.token || '';
    this.handleUpdate = options.handleUpdate || function(){};
    this.handleStore = options.handleStore || function(){};
    this.handleDelete = options.handleDelete || function(){};
    this.handleGet = options.handleGet || function(){};
    this.handleError = options.handleError || function(){};
    this.handleBeforeSend = options.handleBeforeSend || function(){};
    this.handleSuccess = options.handleSuccess || function(){};
    this.recordId = -1;
    this.clearAfterStore = options.clearAfterStore || true;
    this.clearAfterUpdate = options.clearAfterUpdate || true;
    this._init();
}

Formodel.templates = {
    loading:'<i class="fa fa-spinner faa-spin animated"></i>',
    success:'<i class="fa fa-eye"></i>',
    error:'<i class="fa fa-exclamation-triangle"></i>'
};

Formodel.prototype.getForm = function () {
    return $('#' + this.form);
};

Formodel.prototype.getAttributes = function (key) {
    return (key !== undefined) ? this.attributes[key] : this.attributes;
};

Formodel.prototype.getUrl = function (id) {
    id = id || '';
    return this.getRootUrl() + '/' + this.getModel() + '/' + id;
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

Formodel.prototype.get = function (id) {
    this.recordId = id;
    var data = this.getAjaxData(),
        url = this.getUrl(id);
    this._ajax(url, 'GET', data, this.handleGet);
};

Formodel.prototype.fillWith = function (record) {
    console.log(record);
    var attributes = this.getAttributes();
    for(var key in attributes){
        this.fillInput(attributes[key], key, record[key]);
    }
};

Formodel.prototype.clear = function(){
    var attributes = this.getAttributes();
    for(var key in attributes){
        this.fillInput(attributes[key], key, '');
    }
};

Formodel.prototype.new = function () {
    this.recordId = -1;
    this.clear();
};

Formodel.prototype.fillInput = function (tag, name, value) {
    switch (tag.toLowerCase()) {
        case 'checkbox':
        case 'radio':
            break;
        default:
            var selector = tag + '[name="' + name + '"]';
            console.log($(selector).val(value.trim()));
    }
};

Formodel.prototype.getInputValue = function (tag, name) {
    switch (tag.toLowerCase()) {
        case 'checkbox':
        case 'radio':
            break;
        default:
            var selector = tag + '[name="' + name + '"]';
            return $(selector).val().trim();
    }
};

Formodel.prototype.getFormData = function () {
    var data = {},
        attributes = this.getAttributes();
    for(var key in attributes){
        var value = this.getInputValue(attributes[key], key);
        data[key] = value;
    }
    return data;
};

Formodel.prototype.save = function() {
    console.log(this.getFormData());
}

Formodel.prototype._init = function() {
    var context = this;
    this.getForm().submit(function(e){
        e.preventDefault();
        context.save();
    });
}

Formodel.prototype._ajax = function(url, type, data, handler) {
    var context = this;
    $.ajax({
        url:url,
        type:type,
        data:data,
        beforeSend:function(){
            context.handleBeforeSend(context);
        },
        success:function(response){
            if(type == 'GET'){
                context.fillWith(response);
            }
            context.handleSuccess(context, response);
            handler(context, response);
        },
        error:function(response){
            context.handleError(context, response);
        },
    });
}

/*function Formodel(modal, model, attributes){
    this.modal = modal;
    this.model = model;
    this.attributes = attributes;
    this.currentElement = undefined;
}

Formodel.templates = {
    loading:'<i class="fa fa-spinner faa-spin animated"></i>',
    success:'<i class="fa fa-eye"></i>',
    error:'<i class="fa fa-exclamation-triangle"></i>'
}

Formodel.prototype.getModal = function () {
    return $('#'+this.modal);
};

Formodel.prototype.getAttributes = function () {
    return this.attributes;
};

Formodel.prototype.getUrl = function (id) {
    return '/'+this.model+'/'+(id || '');
};

Formodel.prototype.getCurrentElement = function() {
    return $(this.currentElement);
}

Formodel.prototype.setId = function (id) {
    var modal = this.getModal(),
        form = modal.find('form');
    modal.find('input[name="record_id"]').val(id);
    if(id > -1){
        form.attr('action', form.attr('action')+id);
    }
    else{
        form.attr('action', form.attr('data-baseurl'));
    }
};

Formodel.prototype.fill = function (record) {
    var modal = this.getModal(),
        head = modal.find('.modal-header'),
        body = modal.find('.modal-body'),
        update = (record !== undefined);

    this.setId(update ? record.id : -1);
    $.each(this.attributes, function(i,v){
        if(v != 'checkbox' && v != 'radio'){
            var value = (update) ? record[i] : '',
                element = v+'[name="'+i+'"]';
            if(value == '' && v == 'select'){
                value = $(element).find('option:first').val();
            }
            body.find(element).val(value);
            body.find(element).change();
        }
        else{
            var element = 'input[type="'+v+'"][name="'+i+'"]';
            body.find(element).bootstrapToggle((record !== undefined && record[i] == 1) ? 'on' : 'off');
        }
    });
    modal.modal();
};

Formodel.prototype.get = function (id, element) {
    var self = this;
    this.currentElement = element || '';
    $.ajax({
        url:self.getUrl(id),
        type:'GET',
        success:function(response){
            self.handleSuccess(self, response);
        },
        error:function(response){
            self.handleError(self, response);
        },
        beforeSend:function(){
            self.handleBeforeSend(self);
        },
    });
};

Formodel.prototype.handleSuccess = function(context, response){
    context.getCurrentElement().html(Formodel.templates.success);
    context.fill(response);
}
Formodel.prototype.handleError = function(context, response){
    context.getCurrentElement().html(Formodel.templates.error);
}
Formodel.prototype.handleBeforeSend = function(context){
    context.getCurrentElement().html(Formodel.templates.loading);
}*/
