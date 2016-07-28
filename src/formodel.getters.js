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
        if(typeof attributes[key] != 'string'){
            data[key] = attributes[key].get(this);
        } else {
            var value = this.getInputValue(attributes[key], key);
            data[key] = value || null;
        }
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
