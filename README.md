# Formodeljs
###### By Nicolas Boisvert :: nicklay@me.com

### Javascript library for RESTful api form manipulation with your database model

##### Purposes

You can easily manage asynchronous record management to your database on a RESTful API. With easy methods like `.get(1)`, `.new()` and `.save()`,  you'll be able to call your api with the informations you need.

##### Options

You can customize a lot of the thing, like callbacks, error list or event error status code. You can use the `.handleGet()` to configure special things after a get is done like, for example, poping a modal. You specify a CSRF token if you need to. All the tests are done with a Laravel API, a lot of stuff are already configured to match it.

### Requirements
- Jquery v.2+

## Installation

### npm

Just call `npm install formodeljs` in you terminal to install it.

### Download

Download it from the Github repository.

## Usage

### Basic example
Let's have a blog post form, with a title and a body for example. The only required stuff are the form `id`, the `data-model` attribute, which is your database model. It'll be used to perform any requests. Don't forget to include your model attributes, sur as our `input` title and our `textarea` for the body.
```html
<form id="postForm" data-model="posts">
    <input type="text" name="title">
    <textarea name="body"></textarea>
    <button type="submit">Post</button>
</form>
```

To invoke the Formodel object, exectue this in a script tag. You pass in an object for your options. You need at least these two parameters `form` and `attributes`.
```js
    var form = new Formodel({
        form:'postForm',
        attributes: {
            'title':'input',
            'body':'textarea'
        }
    });
```

And it's done.

#### Create a new post
To create a new post (Doesn't matter if the form is filled or not), call the `.new()` method. It'll empty up de field so you can fill in a new post. If you configure a `.handleNew(context)` option (context as the current Formodel instance), it'll be executed once the form has been cleared. When you'll call the `.save()` method, Formodel will make a call to `/posts` with a `POST` method to your server to store it.

#### Getting a post
To get a post, you use the method `.get(1)` with the id of the post you want to have. Formodel will make an ajax call to `/posts/1` with the `GET` method. Once te request will end, the form will be filled. You could add the option `.handleGet(context, response)` to do manipulation once the request is done (The context is the Formodel instance and the response is what the server returned).

#### Updating a post
If you successfully got a post, you can now modify it as you wish. When you'll call the `.save()` method, it'll make an ajax call to your server with a `PUT` method to update at the address `/posts/1`. If you haven't got an existing record before, it'll call to store the new post instead of updating. If you want to perform some special moves after, just add a `.handleUpdate(context, response)` callback to your options.

#### Deleting
Of course, you can't delete something that don't exist. So, once you got an existing post, simply call the `.delete()` method to make a call to `/posts/1` with a `DELETE` method. You could specify a `.handleDelete(context, response)` method to do some special stuff after the record is deleted.

### Callbacks
Formodel already includes a lot of callback that you can use to customize how it's going. Every callback receive a `context` parameter which represents the current Formodel instance. Here's a list of the available callbacks.

##### Methods callbacks
- `handleUpdate` : Executed after a successful update. It also receives the server response.
- `handleStore` : Executed after a successful store. It also receives the server response.
- `handleDelete` : Executed after a successful delete. It also receives the server response.
- `handleGet` : Executed after a successful get. It also receives the server response with the datas.
- `handleNew` : Executed after the form has been prepared to be filled.

##### Ajax callbacks
These are called at each ajax callbacks.
- `handleError` : Executed after the server returned an error, it receives the server response. You could use it to display error message.. But for form validation messages, wait, there's more coming to you.
- `handleBeforeSend` : Executed before the ajax is called.
- `handleSuccess` : Executed after a successful request. It also receive the response of the server.

##### Target callbacks
When you are calling the `.get()`, `.new()` or the `.save()` methods. You can pass in a parameter `target` which should represent the target who triggered the method (Like a button for example). Within these callbacks, the first parameter is the `target`.
- `targetBefore` : Executed before the ajax is done.
- `targetAfter` : Executed after the request. You'll receive a second parameter which is a boolean if the request succeeded or not. You also receive, as a third parameter, the server response.

### Error list
At the instanciation of your Formodel object, you can add the id of a ul element as `errorList` option where you want errors to append and easily be shown. You could also add the `appendError` callback if you want to customize the li appendment. It receive the error and it by default return a `'<li>' + error + '</li>'`

### Options
Along the callbacks, you can also customize the following options.

## Conclusion

Thank you for using, testing and improving it and feel free to contact me for any question.

Ending joke :
> **A** : Knock, Knock; **B** : Who's there?; ... *very long pause*...; **A** : Java.
