/* global Formodel */
Formodel.prototype.setRecordId = function(id) {
    id = parseInt(id, 10);
    this.recordId = (id !== undefined && id !== null && id > -1 && !isNaN(id)) ? id : -1;
};

Formodel.prototype.fillInput = function(tag, name, value) {
    var selector = '';
    switch(tag.toLowerCase()) {
        case'checkbox':
        case'radio':
            selector = 'input[type="' + tag + '"][name="' + name + '"]';
            value = (!isNaN(parseInt(value, 10))) ? parseInt(value, 10) : value;
            this.getForm().find(selector).prop('checked', value).change();
            break;
        case'select':
            selector = tag + '[name="' + name + '"]';
            if(value == null || value == '' || value < 0) {
                value = this.getForm().find(selector).find('option:first').val();
            }
            this.getForm().find(selector).val(value).change();
            break;
        default:
            value = (typeof value == 'string') ? value.trim() : value;
            selector = tag + '[name="' + name + '"]';
            this.getForm().find(selector).val(value).change();
    }
};

Formodel.prototype.fillCustom = function(key, callback, value) {
    callback(key, value, this);
};

Formodel.prototype.setErrors = function(context, errors) {
    var list = context.getErrorList();
    if(list != null) {
        list.html('');
        if(errors !== undefined) {
            $.each(errors, function(_i, v) {
                list.append(context.appendError(v[0]));
            });
            list.slideDown();
        } else {
            list.hide();
        }
    }
};

Formodel.prototype.fillWith = function(record) {
    var attributes = this.getAttributes();
    for(var key in attributes) {
        if(typeof attributes[key] != 'string') {
            this.fillCustom(key, attributes[key].set, record[key]);
        } else {
            this.fillInput(attributes[key], key, record[key]);
        }
    }
};

Formodel.prototype.addOtherData = function(key, item) {
    this.otherData[key] = item;
};

Formodel.prototype.setOtherData = function(data) {
    this.otherData = data || {};
};

Formodel.prototype.removeOtherData = function(key) {
    delete this.otherData[key];
};
