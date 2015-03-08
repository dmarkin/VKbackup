function createView(user, fullCollection) {
    //пространство имен
    window.App = {
        Models: {},
        Views: {},
        Collections: {}
    };

    //хэлпер шаблона
    window.template = function (id) {
        return _.template($('#' + id).html());
    };

    //Модель человека
    App.Models.Person = Backbone.Model.extend({
        defaults: {
            name: '',
            age: '',
            surname: '',
            bdate: '',
            city: '',
            country: ''
        },

        inizialize: function () {
            this.model.on('invalid', function (model, error) {
                alert(error);
            })
        }
        /*,

         validate: function (attrs) {

         var regexpName = /^[A-Z][a-z -]+$/g;
         if (!regexpName.test($.trim(attrs.name))) {
         return 'The name isn\'t correct!';
         }
         ;

         var regexpSurname = /^[A-Z][a-z-]+$/g;
         if (!regexpSurname.test($.trim(attrs.surname))) {
         return 'The surname isn\'t correct!';
         }
         ;

         if (attrs.age <= 0) {
         return 'The age isn\'t correct!';

         }
         ;
         return false;
         }*/
    });

    //Список людей
    App.Collections.People = Backbone.Collection.extend({
        model: App.Models.Person
    });

    //Вид списка друзей
    App.Views.People = Backbone.View.extend({
        tagName: 'ol',

        initialize: function () {
            this.listenTo(this.collection, 'add', this.addOne);
            //this.collection.on('add', this.addOne, this );
        },

        render: function () {
            this.collection.each(function (person) {
                var personView = new App.Views.Person({model: person});
                this.$el.append(personView.render().el);
            }, this);
            return this;
        },

        addOne: function (person) {
            var personView = new App.Views.Person({model: person});
            $('#form-name').val('');
            $('#form-surname').val('');
            $('#form-age').val('');
            this.$el.append(personView.render().el);
        }
    });

    //Вид одного друга
    App.Views.Person = Backbone.View.extend({
        tagName: 'li',

        template: window.template('personTemplate'),
        //template: _.template('<strong><%= name %></strong> ( <%= age %> ) - <%= job %>') - вставили в HTML

        initialize: function () {
            this.render();
            this.listenTo(this.model, 'change', this.render);
            //this.model.on('change', this.render, this);
            this.listenTo(this.model, 'destroy', this.destroy);
            //this.model.on('destroy', this.destroy, this);
            this.listenTo(this.model, 'getWideInfo', this.getWideInfo);
            this.listenTo(this.model, 'closeWideInfo', this.closeWideInfo);
        },

        render: function () {
            this.$el.addClass('friend');
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },

        events: {
            'click .edit': 'editPerson',
            'click .delete': 'destroy',
            'mouseover .name': 'getWideInfo',
            'mouseleave .name': 'closeWideInfo'
        },

        destroy: function () {
            this.$el.remove();
        },

        editPerson: function () {
            var newPersonName = prompt('How rename person?', this.model.get('name'));
            this.model.set('name', newPersonName);//, {validate: true});
            var newPersonSurname = prompt('How resurname person?', this.model.get('surname'));
            this.model.set('surname', newPersonSurname);//, {validate: true});
        },

        getWideInfo: function () {
            if (this.$el.find('.wide-info').length === 0) {
            this.$el.find('.name').append($('<div>')
                    .addClass('wide-info')
                    .html('<a href="https://vk.com/id' + this.model.get('uid') + '"><img src="' + this.model.get('photo_100') + '" /></a>')
                    .hide());
            this.$el.find('img').on('load', function () {
                    $(this).show();});
            } else {
            this.$el.find('.wide-info').show();
            }
        },

        closeWideInfo: function () {
            this.$el.find('.wide-info').hide();
        }
    });

    //Вид выбранного пользователя
    App.Views.CurrentUser = Backbone.View.extend({
        tagName: 'div',

        template: window.template('personTemplate'),
        //template: _.template('<strong><%= name %></strong> ( <%= age %> ) - <%= job %>') - вставили в HTML

        initialize: function () {
            this.render();
        },

        render: function () {
            return $('<img>').attr('src', user.response[0].photo_100);
        },

        events: {
            'mouseover .name': 'getWideInfo',
            'mouseleave .name': 'closeWideInfo'
        },

        getWideInfo: function () {
            if (this.$el.find('.wide-info').length === 0) {
                this.$el.find('.name').append($('<div>')
                    .addClass('wide-info')
                    .html('<img src="' + this.model.get('photo_100') + '" />')
                    .hide());
                this.$el.find('img').on('load', function () {
                    $(this).show();});
            } else {
                this.$el.find('.wide-info').show();
            }
        },

        closeWideInfo: function () {
            this.$el.find('.wide-info').hide();
        }
    });

    App.Views.AddPerson = Backbone.View.extend({
        el: '#addPerson',

        events: {
            'submit': 'submit'
        },

        initialize: function () {

        },

        submit: function (event) {
            event.preventDefault();
            var newPersonName = $(event.currentTarget).find('#form-name').val();
            var newPersonSurname = $(event.currentTarget).find('#form-surname').val();
            var newPersonAge = Math.round($(event.currentTarget).find('#form-age').val()).toFixed(0);
            var newPerson = new App.Models.Person({name: newPersonName, surname: newPersonSurname, age: newPersonAge});
            if (this.validate(newPerson.attributes)) {
                this.collection.add(newPerson);
            }
        }/*,

         validate: function (attrs) {
         var regexpName = /^[A-Z][a-z -]+/g;
         if (!regexpName.test($.trim(attrs.name))) {
         $.alert('The name isn\'t correct!');
         return false;
         }
         ;

         var regexpSurname = /^[A-Z][a-z -]+/g;
         if (!regexpSurname.test($.trim(attrs.surname))) {
         alert('The surname isn\'t correct!');
         return false;
         }
         ;

         if (attrs.age <= 0) {
         alert('The age isn\'t correct!');
         return false;
         }
         ;
         return true;
         }*/
    });

    var currentUser = new App.Views.CurrentUser();

    var peopleCollection = new App.Collections.People(fullCollection);

    var peopleView = new App.Views.People({collection: peopleCollection});

    $('.user-photo').append(currentUser.render());

    $('.data').append(peopleView.render().el);

    var addPersonView = new App.Views.AddPerson({collection: peopleCollection});
};