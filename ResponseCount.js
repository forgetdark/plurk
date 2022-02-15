javascript:(function(){
  var $loader = (function () {
    var loaderStyle = document.createElement('style');
    loaderStyle.id = 'loader-style';
    loaderStyle.innerHTML = `.loader-overlay {
      visibility: hidden;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 999999;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.6);
    }
    .loader-model {
      visibility: hidden;
      position: relative;
      width: 2.5em;
      height: 2.5em;
      transform: rotate(165deg);
      z-index: 99999999;
    }
    .loader-model:before,
    .loader-model:after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      display: block;
      width: 0.5em;
      height: 0.5em;
      border-radius: 50px;
      transform: translate(-50%, -50%);
    }
    .loader-model:before {
      animation: before 2s infinite;
    }
    .loader-model:after {
      animation: after 2s infinite;
    }
    @keyframes before {
      0% {
        width: 0.5em;
        box-shadow:
          1em -0.5em rgb(255, 238, 170),
          -1em 0.5em rgb(204, 170, 136);
      }
      35% {
        width: 2.5em;
        box-shadow:
          0 -0.5em rgb(255, 238, 170),
          0 0.5em rgb(204, 170, 136);
      }
      70% {
        width: 0.5em;
        box-shadow:
          -1em -0.5em rgb(255, 238, 170),
          1em 0.5em rgb(204, 170, 136);
      }
      100% {
        box-shadow:
          1em -0.5em rgb(255, 238, 170),
          -1em 0.5em rgb(204, 170, 136);
      }
    }
    @keyframes after {
      0% {
        height: 0.5em;
        box-shadow:
          0.5em 1em rgb(136, 136, 204),
          -0.5em -1em rgb(255, 136, 187);
      }
      35% {
        height: 2.5em;
        box-shadow:
          0.5em 0 rgb(136, 136, 204),
          -0.5em 0 rgb(255, 136, 187);
      }
      70% {
        height: 0.5em;
        box-shadow:
          0.5em -1em rgb(136, 136, 204),
          -0.5em 1em rgb(255, 136, 187);
      }
      100% {
        box-shadow:
          0.5em 1em rgb(136, 136, 204),
          -0.5em -1em rgb(255, 136, 187);
      }
    }
    .loader-model {
      position: fixed;
      top: calc(50% - 2.5em / 2);
      left: calc(50% - 2.5em / 2);
    }`;
    var loaderOverlay = document.createElement('div');
    loaderOverlay.classList.add('loader-overlay');
    var loaderModel = document.createElement('div');
    loaderModel.classList.add('loader-model');
    return {
      show: function () {
        document.body.appendChild(loaderStyle);
        document.body.appendChild(loaderOverlay);
        document.body.appendChild(loaderModel);
        document.querySelector('.loader-overlay').style.visibility = 'visible';
        document.querySelector('.loader-model').style.visibility = 'visible';
      },
      hide: function () {
        document.getElementById('loader-style').remove();
        document.querySelector('.loader-overlay').remove();
        document.querySelector('.loader-model').remove();
      }
    };
  })();

  var $toTop = function (topEl) {
    window.document.documentElement.scrollTop = topEl.offsetTop;
    window.pageYOffset = topEl.offsetTop;
    document.body.scrollTop = topEl.offsetTop;
  };

  var $createResult = function (totalCount, allResult) {
    var style = document.createElement('style');
    style.innerHTML = `
    .response_info { border-bottom: 1px solid #CCC; }
    .response_info .result-count { padding: 5px; margin: 5px; }
    .response_info .search-sel { padding: 5px; margin: 5px; }
    .response_info .search-ipt { padding: 5px; margin: 5px; }
    .response_info .result-info button { margin-left: 5px; }
    .response_info #result-info { padding: 5px; margin: 5px; }
    `;
    document.body.appendChild(style);

    var selectArray = [];
    for (const [index, item] of Object.entries(allResult)) {
      selectArray.push('<option value="' + item.name + '" label="' + item.name + '(' + item.count + ')' + '">' + item.name + '(' + item.count + ')' + '</option>');
    }

    var count = document.createElement('div');
    count.classList.add('result-count');
    count.innerHTML = '<b>實際回應人數(不含噗主)：</b>' + (totalCount - 1);
    document.querySelector('.response_info').appendChild(count);

    var info = document.createElement('div');
    info.classList.add('result-info');
    var infoHtml = [];
    infoHtml.push('<select class="search-sel"><option value="" label="">請選擇ID名稱</option>' + selectArray.join('') + '</select>');
    infoHtml.push('<input type="search" list="search-list" class="search-ipt" placeholder="請輸入ID名稱" />');
    infoHtml.push('<datalist id="search-list">' + selectArray.join('') + '</datalist>');
    infoHtml.push('<button type="button" class="search-btn">搜尋</button>');
    infoHtml.push('<button type="button" class="clear-btn">清除結果</button>');
    infoHtml.push('<div id="result-info"></div>');
    info.innerHTML = infoHtml.join('');
    document.querySelector('.response_info').appendChild(info);
  };

  var $getResponse = function () {
    $loader.show();
    document.querySelector('.load-all-older').click();
    return new Promise(function (resolve, reject) {
      var startInterval = setInterval(function(){
        var loadOlderHolder = document.querySelector('.load-older-holder');
        if (loadOlderHolder.style.display === 'none') {
          resolve(startInterval);
        }
      }, 1000);
    });
  };

  if (document.querySelectorAll('#result-info').length == 0) {
    $getResponse().then(function (startInterval) {
      window.clearInterval(startInterval);

      var content = [];
      var list = document.querySelectorAll('.text_holder');
      list.forEach(function(item, index) {
        content[index] = item;
      });

      var nameList = document.querySelectorAll('.name');
      var result = [];
      var total = 0;
      nameList.forEach(function(item, index) {
        var name = item.innerText;
        if (typeof result[name] == 'undefined') {
          result[name] = {
            'name': name,
            'count': 0,
            'content': []
          };
          total++;
        }
        result[name]['count']++;
        result[name]['content'][result[name]['count'] - 1] = content[index];
      });

      $createResult(total, Object.values(result).sort(function (a, b) {
        return a.count > b.count ? 1 : -1;
      }).reverse());

      var searchSel = document.querySelector('.search-sel');
      searchSel.addEventListener('change', function (e) {
        document.querySelector('.search-ipt').value = e.target.value;
        document.querySelector('.search-btn').click();
      });

      var searchBtn = document.querySelector('.search-btn');
      searchBtn.addEventListener('click', function (e) {
        var key = document.querySelector('.search-ipt').value;
        document.querySelector('.search-sel').value = key;
        if (key != '') {
          var searchResult = [];
          searchResult.push('<div><b>回應人：</b>' + result[key]['name'] + '</div>');
          searchResult.push('<div><b>回應次數：</b>' + result[key]['count'] + '</div>');
          searchResult.push('<div style="margin-bottom: 2px;"><b>回應內容：</b></div>');
          for (var i=0; i<result[key]['content'].length; i++) {
            var bg = (i%2==0) ? '#EEE;' : '#FFF;';
            var subStr = new RegExp('\n','ig');
            var str = result[key]['content'][i].innerText;
            searchResult.push('<div style="padding: 5px; background:'+bg+'">' + str.replace(subStr, '<br>') + '</div>');
          }
          document.getElementById('result-info').innerHTML = searchResult.join('');
        } else {
          document.querySelector('.clear-btn').click();
        }
      });

      var clearBtn = document.querySelector('.clear-btn');
      clearBtn.addEventListener('click', function (e) {
        document.getElementById('result-info').innerHTML = '';
        document.querySelector('.search-ipt').value = '';
        document.querySelector('.search-sel').value = '';
      });

      $toTop(document.getElementById('result-info'));
      $loader.hide();
    });
  }
})();
