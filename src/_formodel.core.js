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
    this.targetBefore = options.targetBefore || function(){};
    this.targetAfter = options.targetAfter || function(){};
    this.recordId = -1;
    this.clearAfterStore = options.clearAfterStore || true;
    this.clearAfterUpdate = options.clearAfterUpdate || true;
    this.usingTemplates = options.usingTemplates || true;
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
}
