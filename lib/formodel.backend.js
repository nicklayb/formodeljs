'use strict';

/* global Formodel */
Formodel.prototype._ajax = function (url, type, data, handler) {
    var context = this;
    data = this.getAjaxData(data);
    $.ajax({
        url: url,
        type: type,
        data: data,
        beforeSend: function beforeSend() {
            context._handleBeforeSend(context);
            context._targetBefore();
            if (context.usingTemplates) {
                context._setTargetTemplate('loading');
            }
        },
        success: function success(response) {
            context._targetAfter(true, response);
            context.handleSuccess(context, response);
            if (context.usingTemplates) {
                context._setTargetTemplate(null);
            }
            handler(context, response);
        },
        error: function error(response) {
            context._targetAfter(false, response);
            context._handleError(context, response);
            if (context.usingTemplates) {
                context._setTargetTemplate('error');
            }
        }
    });
};

Formodel.prototype._init = function () {
    var context = this;
    this.getForm().submit(function (e) {
        e.preventDefault();
        context.save($(this).find('button[type="submit"]'));
    });
};

Formodel.prototype._update = function () {
    var url = this.getUrl(this.getRecordId()),
        data = this.getFormData();
    this._ajax(url, 'PUT', data, this._handleUpdate);
};

Formodel.prototype._store = function () {
    var url = this.getUrl(),
        data = this.getFormData();
    this._ajax(url, 'POST', data, this._handleStore);
};

Formodel.prototype._setTargetTemplate = function (template) {
    if (this.target !== null && this.target !== undefined) {
        if (template !== undefined && template !== null) {
            if ($(this.target).attr('data-original') == null || $(this.target).attr('data-original') == '' || $(this.target).attr('data-original') === undefined) {
                $(this.target).attr('data-original', $(this.target).html());
            }
            $(this.target).html(Formodel.templates[template]);
        } else {
            $(this.target).html($(this.target).attr('data-original'));
        }
    }
};

Formodel.prototype.setTarget = function (target) {
    if (target === undefined || target == null || target == '') {
        target = null;
    }
    this.target = target;
};

Formodel.prototype._targetAfter = function (success, response) {
    this.targetAfter(this.target, success, response);
};

Formodel.prototype._targetBefore = function () {
    this.targetBefore(this.target);
};

Formodel.prototype._appendError = function (error) {
    return '<li>' + error + '</li>';
};