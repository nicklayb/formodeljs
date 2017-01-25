'use strict';

function Formodel(options) {
    this.form = options.form;
    this.model = options.model || this.getForm().attr('data-model');
    this.errorListCode = options.errorListCode || 422;
    this.attributes = options.attributes;
    this.rootUrl = options.rootUrl || '';
    this.tokenKey = options.tokenKey || '_token';
    this.token = options.token || '';
    this.idKey = options.idKey || null;
    this.errorList = options.errorList || null;
    this.appendError = options.appendError || this._appendError;
    this.handleUpdate = options.handleUpdate || function () {};
    this.handleStore = options.handleStore || function () {};
    this.handleDelete = options.handleDelete || function () {};
    this.handleGet = options.handleGet || function () {};
    this.handleNew = options.handleNew || function () {};
    this.handleError = options.handleError || function () {};
    this.handleBeforeSend = options.handleBeforeSend || function () {};
    this.handleSuccess = options.handleSuccess || function () {};
    this.targetBefore = options.targetBefore || function () {};
    this.targetAfter = options.targetAfter || function () {};
    this.clearAfterStore = options.clearAfterStore || true;
    this.clearAfterUpdate = options.clearAfterUpdate || true;
    this.usingTemplates = options.usingTemplates || true;
    this.storable = options.storable || true;
    this.updatable = options.updatable || true;
    this.deletable = options.deletable || true;
    this.gettable = options.gettable || true;
    this.otherData = options.otherData || {};
    this.recordId = -1;
    this.target = null;
    this.targetOriginal = null;
    this._init();
}

Formodel.templates = {
    loading: '<i class="fa fa-spinner faa-spin animated"></i>',
    success: '<i class="fa fa-eye"></i>',
    error: '<i class="fa fa-exclamation-triangle"></i>'
};

Formodel.prototype.clear = function () {
    var attributes = this.getAttributes();
    for (var key in attributes) {
        if (typeof attributes[key] != 'string') {
            attributes[key].clear(this);
        } else {
            this.fillInput(attributes[key], key, '');
        }
    }
};

Formodel.prototype.get = function (id, target) {
    this.setTarget(target);
    if (this.gettable) {
        this.setRecordId(id);
        var data = this.getAjaxData(),
            url = this.getUrl(this.getRecordId());
        this._ajax(url, 'GET', data, this._handleGet);
    }
};

Formodel.prototype.new = function () {
    this.setRecordId(-1);
    this.clear();
    this._handleNew(this);
};

Formodel.prototype.destroy = function (target) {
    this.setTarget(target);
    if (this.getRecordId() > -1) {
        if (this.deletable) {
            var url = this.getUrl(this.getRecordId()),
                data = this.getFormData();
            this._ajax(url, 'DELETE', data, this._handleDelete);
        }
    }
};

Formodel.prototype.save = function (target) {
    this.setTarget(target);
    if (this.getRecordId() > 0 && this.updatable) {
        this._update();
    } else if (this.storable) {
        this._store();
    }
};

$.fn.extend({
    formodel: function formodel(options) {
        var id = $(this).attr('id');
        options.form = id;
        return new Formodel(options);
    }
});