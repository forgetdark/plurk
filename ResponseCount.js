javascript:(function(){
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

  var $getResponse = async function () {
    while (true) {
      var loadOlderHolder = document.querySelector('.load-older-holder');
      var loadButton = document.querySelector('.button.load-older');
      if (!loadOlderHolder || loadOlderHolder.classList.contains('hide') || !loadButton) {
        console.log('已載入全部留言');
        break;
      }
      loadButton.click();
      await new Promise((resolve) => {
        var checkInterval = setInterval(() => {
          var isLoading = !loadOlderHolder.querySelector('.loading').classList.contains('hide');
          if (!isLoading) {
            clearInterval(checkInterval);
            resolve();
          }
        }, 500);
      });
      await new Promise(r => setTimeout(r, 300));
    }
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
    });
  }
})();
