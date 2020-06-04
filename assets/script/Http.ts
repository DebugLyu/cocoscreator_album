
export class Http {

    public static get(url, cb) {
        let getRequest = cc.loader.getXMLHttpRequest();
        getRequest.onreadystatechange = function () {
            if (getRequest.readyState === 4 && (getRequest.status >= 200 && getRequest.status < 300)) {
                var respone = getRequest.responseText;
                cb(respone);
            }
        };
        getRequest.open("GET", url, true);
        if (cc.sys.isNative) {
            getRequest.setRequestHeader("Accept-Encoding", "gzip,deflate");
        }
        getRequest.timeout = 5000;
        getRequest.send();
    }

    public static post(url, params, callback) {
        var postRequest = cc.loader.getXMLHttpRequest();
        postRequest.onreadystatechange = function () {
            cc.log('postRequest.readyState=' + postRequest.readyState + '  postRequest.status=' + postRequest.status);
            if (postRequest.readyState === 4 && (postRequest.status >= 200 && postRequest.status < 300)) {
                var respone = postRequest.responseText;
                callback(respone);
            } else {
                callback(-1);
            }
        };
        postRequest.open("POST", url, true);

        if (cc.sys.isNative) {
            postRequest.setRequestHeader("Accept-Encoding", "gzip,deflate", "text/html;charset=UTF-8");
            postRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        }
        postRequest.timeout = 20000;
        postRequest.send(params);
    }

}