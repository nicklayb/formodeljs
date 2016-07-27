function Formodel(modal, model, attributes){
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

Formodel.prototype.get = function (element, id) {
    var self = this;
    this.currentElement = element;
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
}
