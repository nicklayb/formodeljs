# Formodeljs
###### By Nicolas Boisvert :: nicklay@me.com

### Javascript library for RESTful api form manipulation with your database model

This should be use when you wanna manage datatables and quick record edition from your RESTful api. Let's say for example that you have a datatable containing all of your user. Of course you could just make a "show" page where you show you user and another page where you can add new user. But the thing is that you need to do 2 more page for an action that basically requires the same data. If you add the page reload time and stuff like that, it's starts being a pain.

What I suggest you is to use only **form** for two or more model action. For now, you must use it in a Boostrap's modal.

### Requirements
- Jquery v.2+
- Bootstrap v.3

## Installation

### npm

Just call `npm install formodeljs` in you terminal to install it.

### download

Download it from the Github repository.

## Usage

Let's say you have a user form like the following (The ... represents the rest of the Bootstrap's modal, go check their docs for more info):
```html
<div class="modal fade" tabindex="-1" role="dialog" id="userModal">
    ...
    <form type="POST">
        <label for="firstname">Firstname :</label>
        <input type="text" name="firstname" value="" class="form-control">
        <label for="lastname">Lastname :</label>
        <input type="text" name="lastname" value="" class="form-control">
        <label for="username">Username :</label>
        <input type="text" name="username" value="" class="form-control">
        <label for="password">Password :</label>
        <input type="text" name="password" value="" class="form-control">

        <button type="submit" class="btn btn-primary">Submit</button>
    </form>
    ...
</div>
```

Now you need to create an instance of Formodel for this form, here's the syntax.
```js
var formodel = new Formodel('modalId', 'databaseModel', {
    'attribute':'type',
});
```
The third parameter is an object of your model field that can be editable by your modal. The key is the column name and the value is the type of input (Which would be textarea for a `text` field)

In our example this would look like this
```js
var formodel = new Formodel('userModal', 'users', {
    'firstname': 'input',
    'lastname': 'input',
    'username': 'input',
});
```

And the whole job is done. Why didn't we add the password? Because you don't the password to be prefilled in you modal.

#### Fetching a database instance

Let's say for example you want to open a modal for user with the id 1.
```js
    formodel.get(1);
```
Your modal will popup with the `firstname`, `lastname` and `username` of the user at id 1.

It works if your api is RESTful because Formodel does automatically a `GET` of your model at url `/users/1` and it replaces the form `action` attribute to `/users/1` in `POST`

#### Creating a new instance

Let's say you want to pop the modal but completly cleared for a new user entry.
```js
    formodel.fill();
```

Your modal will popup wit all of the attributes empty ready to be filled. It also changes the `action` attribute to `/users` in `POST` so your submission should go to your `store` function in your backend if you respected the RESTful API way.

#### Plans

I currently plans to update the following
- Possible to update within an ajax call instead of a form submission which should be faster than reloading the page.
- Easy callback on ajax callbacks for more possible manipulations.
- Take apart Formodel from the Bootstrap's modal so it can be used on any form

## Conclusion

Thank you for using, testing and improving it and feel free to contact me for any question.

Ending joke :
> **A** : Knock, Knock; **B** : Who's there?; ... *very long pause*...; **A** : Java.
