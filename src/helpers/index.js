import { Promise } from 'es6-promise';
import superagent  from 'superagent';
import  agent  from './request';
import exceptions from 'constants/exception'
import cookie from 'helpers/cookie';
import ua from './ua';
import { CONTACTS } from 'constants'

const SEND = superagent.Request.prototype.send
const END = superagent.Request.prototype.end

export function getCsrfToken(){
    let csrftoken = cookie('csrf') || '';

    if(!csrftoken){
        let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
            , maxPos = $chars.length;

        for (let i = 0; i < 32; i++) {
        　　csrftoken += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        cookie('csrf', csrftoken, { path: '/' })
    }

    return csrftoken;
}

/**
 * SuperAgent
 */
export function _request(options){
    let request = agent(superagent, Promise)

    if(typeof document === 'undefined' && options && options.req &&  options.req.header){
          superagent.Request.prototype.send = SEND
          let _r = {}

          for(let key in request){
              _r[key] = function(){
                  let req = request[key].apply(request, arguments)
                  req.set(options.req.header)
                  return req
              }
          }

          return _r;

    }else{
        /*superagent.Request.prototype.send = function(data){
            //let _data = Object.assign(data || {}, { csrfmiddlewaretoken : getCsrfToken() })
            return SEND.call(this, _data);
        }*/
        //注入跨域
        superagent.Request.prototype.end = function(fn){
            this.withCredentials();
            if(~['POST', 'DELETE', 'PUT'].indexOf(this.method)){
                this.send({ csrfmiddlewaretoken : getCsrfToken() })
            }

            return END.call(this, fn);
        }
    }

    return request
}

/**
 * Reducers 生成工厂函数
 *
 * @params {mix} initialState 默认 state
 * @params {object} handers reduces 的 action 处理
 */
export function createReducer(initialState, handlers) {
    return function reducer(state = initialState, action) {
      if (handlers.hasOwnProperty(action.type)) {
          return handlers[action.type](state, action);
      } else {
          return state;
      }
  }
}

export function parseUrl( url ) {
    var a = document.createElement('a');
    a.href = url;
    return a;
}

export function loginUri(cb) {
        var ext = ''
        if (cb) ext = '?cb=' + encodeURIComponent(cb)
        return `${CONTACTS}/${ext}`

    }

// export function connectHistory(Component) {
//     return React.createClass({
//             mixins: [ History, RouteContext ],
//             render() {
//             return <Component {...this.props} history={this.history} />
//         }
//     })
// }

export function keys(items, primary, prifix=''){

    if(!primary) throw Error('need a primary key!');
    return items.map(function(item){
        let _item = Object.assign({}, item)
        if(!_item.hasOwnProperty('key')) _item.key = `${prifix}_${_item[primary]}`

        return _item
    })
}

export function exception(input){

      let key = 'ERR_SERVER_EXCEPTION';

      if(typeof input === 'string'){
          key = input
      }else if(typeof input === 'object' && input.hasOwnProperty('error') && input.error.hasOwnProperty('response')){
          if(input.error.status >= 400 && input.error.status < 500){
              key = input.error.response.body.result || input.error.response.body.msg
          }
      }
      if(exceptions.hasOwnProperty(key)){
          return exceptions[key]
      }else{
          return exceptions.ERR_SERVER_EXCEPTION
      }
}

export function cx(classNames) {
    if (typeof classNames === 'object') {
        return Object.keys(classNames).filter(function(className) {
            return classNames[className];
        }).join(' ');
    } else {
        return Array.prototype.join.call(arguments, ' ');
    }
}

export function trimMsgType(str) {
    var pathArr = str.split('/');
    if (pathArr.length > 2) {
        return pathArr[1];
    } else {
        return null;
    }
}

export function trim(str, charlist) {

    var whitespace, l = 0,
        i = 0;
        str += '';

    if (!charlist) {
        // default list
        whitespace =
            ' \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000';
    } else {
        // preg_quote custom list
        charlist += '';
        whitespace = charlist.replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '$1');
    }

    l = str.length;
    for (i = 0; i < l; i++) {
        if (whitespace.indexOf(str.charAt(i)) === -1) {
            str = str.substring(i);
            break;
        }
    }

    l = str.length;
    for (i = l - 1; i >= 0; i--) {
        if (whitespace.indexOf(str.charAt(i)) === -1) {
            str = str.substring(0, i + 1);
            break;
        }
    }

    return whitespace.indexOf(str.charAt(0)) === -1 ? str : '';
}

export function getRect(element) {
    let rect;

    if ( typeof (element.getBoundingClientRect) !== 'undefined' ) {
        rect = element.getBoundingClientRect();
    }else{
        let elementScrollLeft;
        let elementScrollTop;

        let actualLeft = element.offsetLeft;
        let actualTop = element.offsetTop;
        let elementHeight = element.clientHeight;
        let elementWidth = element.clientWidth;
        let current = element.offsetParent;

        while (current !== null){
            actualLeft += current.offsetLeft;
            actualTop += current. offsetTop;
            current = current.offsetParent;
        }

        if (document.compatMode == "BackCompat"){
            elementScrollLeft = document.body.scrollLeft;
            elementScrollTop = document.body.scrollTop;
        } else {
            elementScrollLeft = document.documentElement.scrollLeft;
            elementScrollTop = document.documentElement.scrollTop;
        }

        const left = actualLeft - elementScrollLeft;
        const top = actualTop - elementScrollTop;

        rect = {
            left: actualLeft - elementScrollLeft,
            top: actualTop - elementScrollTop,
            right: left + elementWidth,
            bottom: top + elementHeight,
            width: elementWidth,
            height: elementHeight
        }

    }

    return rect;
}

// const defaultTitle = 'WPS 云协作 - 随时随地编辑您的办公文档';
// export function setDocumentTitle(title, reTitle) {
//     let pageTitle = title ? `${title} - ${defaultTitle}` : defaultTitle;
//     if (reTitle) {
//         pageTitle = title;
//     }
//     document.title = pageTitle;
// }

export function getTeamByChatid(teams, chatid) {
    if (!teams || typeof chatid !== 'string') {
        return;
    }

    const [, contacts_id] = chatid.split('_');
    return teams[contacts_id]

}

export function getUserByChatid(users, chatid) {
    if (!users || typeof chatid !== 'string') {
        return;
    }
    return users[`user${chatid}`]

}

export function getContactsId(chatid) {
    if (typeof chatid !== 'string') {
        return;
    }

    const [, contacts_id] = chatid.split('_');
    return contacts_id
}

export function getConversation(targetType, targetId, conversations) {
    return conversations.find(c=>c.targetType === targetType && c.targetId === targetId);
}

export function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}

export let request = _request();

/**
 * 获取分屏控件的默认尺寸
 */
export function getSplitterDefaultSize() {
    let value = cookie('splitter-default-size') || '250';
    return parseInt(value);
}

/**
 * 设置分屏控件的默认尺寸
 * @param size
 */
export function setSplitterDefaultSize(size) {
    cookie("splitter-default-size", size);
}

/**
 * 设置页面标题
 * @param title
 */
export function setDocumentTitle(title) {
    if (!title) {
        title = "WPS云协作";
    }
    document.title = title;
}

//根据title获取styleSheet
function getStyleSheetByTitle(title) {
    for(let i = 0; i < document.styleSheets.length; i++) {
        if (document.styleSheets[i].title == title) {
            return document.styleSheets[i];
        }
    }
}

/**
 * 禁用/启用页面打印功能
 * @param isDisable true 为禁用，false为启用
 */
export function disableBoyPrint(isDisable) {
    let ss = getStyleSheetByTitle('disable-print');
    if (!ss) {
        return false;
    }
    ss.cssRules[0].cssRules[0].style.display = isDisable ? 'none' : 'block';
}