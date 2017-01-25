'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Formodel = exports.Formodel = function () {
    function Formodel(options) {
        _classCallCheck(this, Formodel);

        options = options || {};
        this.setOptions(options);
    }

    _createClass(Formodel, [{
        key: 'setOptions',
        value: function setOptions(options) {
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
        }
    }, {
        key: 'clear',
        value: function clear() {
            var attributes = this.getAttributes();
            for (var key in attributes) {
                if (typeof attributes[key] != 'string') {
                    attributes[key].clear(this);
                } else {
                    this.fillInput(attributes[key], key, '');
                }
            }
        }
    }, {
        key: 'get',
        value: function get(id, target) {
            this.setTarget(target);
            if (this.gettable) {
                this.setRecordId(id);
                var data = this.getAjaxData(),
                    url = this.getUrl(this.getRecordId());
                this._ajax(url, 'GET', data, this._handleGet);
            }
        }
    }, {
        key: 'new',
        value: function _new() {
            this.setRecordId(-1);
            this.clear();
            this._handleNew(this);
        }
    }, {
        key: 'destroy',
        value: function destroy(target) {
            this.setTarget(target);
            if (this.getRecordId() > -1) {
                if (this.deletable) {
                    var url = this.getUrl(this.getRecordId()),
                        data = this.getFormData();
                    this._ajax(url, 'DELETE', data, this._handleDelete);
                }
            }
        }
    }, {
        key: 'save',
        value: function save(target) {
            this.setTarget(target);
            if (this.getRecordId() > 0 && this.updatable) {
                this._update();
            } else if (this.storable) {
                this._store();
            }
        }
    }]);

    return Formodel;
}();

Formodel.templates = {
    loading: '<i class="fa fa-spinner faa-spin animated"></i>',
    success: '<i class="fa fa-eye"></i>',
    error: '<i class="fa fa-exclamation-triangle"></i>'
};