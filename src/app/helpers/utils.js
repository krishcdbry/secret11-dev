const customAlert = (message, isReload) => {
    let elem = document.getElementById('global-message');
    let content = document.getElementById('gloal-message-content');
    let progress = document.getElementById('progress-bar-live');
  
    content.innerHTML = message;
    elem.style.display = "block";
  
    fillProgress();
    
    setTimeout(function() {
      elem.style.display = 'none';
      if (isReload) {''
        window.location = '/';
      }
    }, 3000)
  }

const customError = (message, isReload) => {
    let elem = document.getElementById('global-error');
    let error = document.getElementById('error-message');
    
    error.innerHTML = message;
    elem.style.display = "block";;
  
    setTimeout(function() {
      elem.style.display = "none";
      if (isReload) {''
        window.location = '/';
      }
    }, 4000)
}
const fillProgress = () => {
    var progress = document.getElementById('progress-bar-live');
    let num = 0;
    progress.style.width = 0;
    progress.style.display = "block";
    let interval = setInterval(function () {
     num = num + 15;
        progress.style.width = num+"%"
        if (num > 100) {
          clearInterval(interval)
          
          setTimeout(() => progress.style.display = 'none', 1000);
        
        }
    }, 100);
}


const getIndexOfkey = (inputArr, needleObj) => {

    if (Object.prototype.toString.call(needleObj) !== '[object Object]') {
        return "Not a valid needle(object)"
    }

    if (Object.prototype.toString.call(inputArr) !== '[object Array]') {
        return "Not a valid array";
    }

    var idx = -1;
    var needleKey = Object.keys(needleObj)[0];
    var needleValue = needleObj[needleKey];

    for (var i = 0; i < inputArr.length; i++) {
        var val = inputArr[i];
        if (val[needleKey] == needleValue) {
            idx = i;
            break;
        }
    }

    return idx;
}

const modalToggle = () => {
  let modal = document.getElementsByClassName('modal-container')[0];
  modal.classList.toggle('show');
}
  
  export {
    customAlert,
    fillProgress,
    customError,
    getIndexOfkey,
    modalToggle
  }