'use strict';

var tokenBegin = $(location).attr('href').indexOf('access_token');
var tokenEnd = $(location).attr('href').indexOf('&');
var token = $(location).attr('href').slice(tokenBegin + 13, tokenEnd) || '';
$('#friends-info').on('click', vkFriendsNotes);
$('#friends-clear').on('click', vkFriendsClear);

function vkFriendsNotes() {
    var userid = $('#user-id').val();
    vkFriendsClear();
    var requestUserParameters = 'sex,bdate,city,country,photo_50,photo_100,photo_200_orig,photo_200,photo_400_orig,' +
        'photo_max,photo_max_orig,photo_id,online,online_mobile,domain,has_mobile,contacts,connections,site,' +
        'education,universities,schools,status,last_seen,common_count,relation,relatives,counters,screen_name,' +
        'maiden_name,timezone,occupation,activities,interests,music,movies,tv,books,games,about,quotes,personal,friends_status';
    var userInfoRequestURL = 'https://api.vk.com/method/users.get?user_ids=' + userid + '&fields=' + requestUserParameters + '&access_token=' + token;
    var requestFriendsParameters = 'nickname,domain,sex,bdate,city,country,photo_50,photo_100,photo_200_orig,has_mobile,' +
        'contacts,education,online,relation,last_seen,status,universities';
    var friendsRequestURL = 'https://api.vk.com/method/friends.get?user_id=' + userid + '&order=name&fields=' + requestFriendsParameters + '&access_token=' + token;

    var XHR = function (url) {
        return $.ajax({
            url: url,
            method: 'GET',
            dataType: 'jsonp'
        })
    };

    var requestUserInfo = XHR(userInfoRequestURL).success(function (responseUser) {
        var userString = JSON.stringify(responseUser);
        var user = JSON.parse(userString);
        var requestFriends = XHR(friendsRequestURL);
        requestFriends.success(function (responseFriends) {
            var friendsCollectionString = JSON.stringify(responseFriends);//sortByKey(response, 'user_id');
            var friendsCollection = JSON.parse(friendsCollectionString);
            console.log(friendsCollection['response']);
            createView(user, friendsCollection['response']);
        });
        requestFriends.error(function (responseError) {
            createErrorMessage(responseError);
        });
    });
}

function vkFriendsClear() {
    $('.friend').remove();
    $('#user-id').val('');
}

//create error message with type of error
function createErrorMessage(data, message) {
    $('.main').addClass('error-message').html('<h1 class="error-alert">Ups, something wrong!</h1>');

    $('.main h1').parent().append($('<h2>').addClass('error-alert').html(message));
}

/*function sortByKey(array, key) {
 console.log(array);
 return Array.prototype.slice.call(array).sort(function(a, b) {
 var x = a[key];
 var y = b[key];
 return ((x < y) ? -1 : ((x > y) ? 1 : 0));
 });
 console.log(array);
 }*/