//code by HardPic(evades nickname:SpdRunner)
/*copy-pasted code */ /**  * LocalStorage  *  * Copyright (c) 2015 Vlasenko Fedor (VlasenkoFedor@mail.ru)  * Dual licensed under the MIT and GPL licenses:  * http://www.opensource.org/licenses/mit-license.php  * http://www.gnu.org/licenses/gpl.html  *  * @version 0.0.2  */ ;(function (win) {      var _storage = function (name, value) {         var self;         if (typeof(Storage) == "undefined") {             throw Error('_storage: Web Storage no support');         }         if (_storage.prototype.instance) {             self = _storage.prototype.instance;         } else {             self = Object.create(_storage.prototype);             _storage.prototype.instance = self;             self._init();         }         if (arguments.length == 1) return self.get(name);         if (arguments.length == 2) self.set(name, value);         return self;     };      _storage.prototype = {         _list: {},          /**          * Initialization of a subscription to events          * @private          */         _init: function () {             win.addEventListener('storage', this._storageEvent.bind(this));         },          /**          * Subscription at which name value in localStorage was changed          * @param {String} name          * @param {Function} callback          * @returns {_storage}          */         subscribe: function (name, callback) {             if (name != undefined && typeof callback == "function") {                 if (!this._list.hasOwnProperty(name)) {                     this._list[name] = [];                 }                 this._list[name].push(callback);             }             return this;         },          /**          * UnSubscribe changed in localStorage          * @param {String} name          * @param {Function} callback          * @returns {_storage}          */         unSubscribe: function (name, callback) {             if (this._list.hasOwnProperty(name) && this._list[name].length) {                 if (typeof callback == "function") {                     this._list[name].some(function (el, i, arr) {                         if (el == callback) {                             arr.splice(i, 1);                             return true;                         }                     });                 } else {                     delete this._list[name];                 }             }             return this;         },          /**          * Start followers of events          * @param {Object} e          * @private          */         _storageEvent: function (e) {             e = e || window.event;             if (this._list.hasOwnProperty(e.key)) {                 var that = this;                 this._list[e.key].forEach(function (callback) {                     callback(that.get(e.key), e);                 });             }         },          /**          * Get value name in localStorage          * @param {String} name          */         get: function (name) {             var value = localStorage.getItem(name);             var replace = {                 '0': function () {                     return null                 },                 'n': function (v) {                     return Number(v)                 },                 'b': function (v) {                     return 'true' === (v)                 },                 'd': function (v) {                      return new Date(v)                 },                 'f': function (v) {                     return Function('return ' + v)()                 }             };             return value && /^:[bdfn0]:/.test(value)                 ? replace[value.slice(1, 2)](value.slice(3))                 : JSON.parse(value);         },          /**          * Set value name in localStorage          * @param {String} name          * @param {String|Object|Function|Number} value          * @returns {_storage}          */          set: function (name, value) {             var alias = {                 'Null': '0',                 'Date': 'd',                 'Number': 'n',                 'Boolean': 'b',                 'Function': 'f'             };             var type = Object.prototype.toString.call(value).split(/\s|]/)[1];             if (alias.hasOwnProperty(type)) {                 switch (alias[type]) {                     case 'd':                     case 'f':                         value = value.toString();                         break;                     default:                         value = JSON.stringify(value);                 }                 value = ':' + alias[type] + ':' + value;             } else {                 value = JSON.stringify(value);             }             localStorage.setItem(name, value);             return this;         },          /**          * Remove name in localStorage          * @param {String} name          * @returns {_storage}          */         remove: function (name) {             localStorage.removeItem(name);             return this;         },          /**          * Clear all localStorage          * @returns {_storage}          */         clear: function () {             localStorage.clear();             return this;         }     };     win._storage = _storage; }(window));
var storage = _storage();
var cur=0;
var doQ=0;
if(!storage.get('owner')){storage.set('owner',1);cur=1;}
else{
    cur=2;
}

var kek=function(){};
WebSocket.prototype._send = WebSocket.prototype.send;
WebSocket.prototype.send = function(data){
    if(this.url=='wss://eu.evades.io/api/game/connect?backend=0&game=0' && this.url != kek.url){kek=this;}
	if(this.url=='wss://eu.evades.io/api/game/connect?backend=0&game=0'){
	    if(cur==1){
	        storage.set('do', data.join());
	    }
	}
	this._send(data);
}
function setOwn(){//if some bug and you are "cur==2"
    cur=1;
    document.onkeydown=function(e){
        switch(e.keyCode){
            case 17://ctrl
                if(storage.get('doQ')==1){storage.set('doQ',0);}
                else{storage.set('doQ', 1);}
            break;
        }
    }
}
if(cur==1){
    document.onkeydown=function(e){
        switch(e.keyCode){
            case 17://ctrl
                if(storage.get('doQ')==1){storage.set('doQ',0);}
                else{storage.set('doQ', 1);}
            break;
        }
    }
}

if(cur==2){
    storage.subscribe('do',function(e){
        if(doQ===0){kek._send(new Uint8Array(e.split(',')));}//send your actions to another windows
    });
    storage.subscribe('doQ',function(e){
        doQ=e;//you move || you + all move
    });
}

window.onbeforeunload=function(){
    if(cur==1){
        storage.clear();//write in console if you got a bug with "cur==2", and reload page
    }
}
