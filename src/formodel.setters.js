Formodel.prototype.setRecordId = function (id) {
    id = parseInt(id);
    this.recordId = (id !== undefined && id !== null && id > -1 && !isNaN(id)) ? id : -1;
};

Formodel.prototype.fillInput = function (tag, name, value) {
    switch (tag.toLowerCase()) {
        case 'checkbox':
        case 'radio':
            var selector = 'input[type="' + tag + '"][name="' + name + '"]';
            value = (!isNaN(parseInt(value))) ? parseInt(value) : value;
            this.getForm().find(selector).prop('checked', value).change();
            break;
        case 'select':
            value = (value != null) ? value : -1;
            var selector = tag + '[name="' + name + '"]';
            this.getForm().find(selector).val(value).change();
            break;
        default:
            value = (typeof value == 'string') ? value.trim() : value;
            var selector = tag + '[name="' + name + '"]';
            this.getForm().find(selector).val(value).change();
    }
};

Formodel.prototype.fillCustom = function (key, callback, value) {
    callback(key, value, this);
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
        if(typeof attributes[key] != 'string'){
            this.fillCustom(key, attributes[key].set, record[key]);
        } else {
            this.fillInput(attributes[key], key, record[key]);
        }
    }
};
