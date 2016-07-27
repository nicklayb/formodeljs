Formodel.prototype.setRecordId = function (id) {
    id = parseInt(id);
    this.recordId = (id !== undefined && id !== null && id > -1 && !isNaN(id)) ? id : -1;
};


Formodel.prototype.fillInput = function (tag, name, value) {
    switch (tag.toLowerCase()) {
        case 'checkbox':
        case 'radio':
            break;
        default:
            var selector = tag + '[name="' + name + '"]';
            $(selector).val(value.trim());
    }
};
Formodel.prototype.fillWith = function (record) {
    var attributes = this.getAttributes();
    for(var key in attributes){
        this.fillInput(attributes[key], key, record[key]);
    }
};
