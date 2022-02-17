javascript:(function(){
  var $createStyle = function () {
    var style = document.createElement('style');
    style.innerHTML = `
    .response_info #result-info { padding: 5px; margin: 5px; }
    `;
    document.body.appendChild(style);

    var info = document.createElement('div');
    info.innerHTML = '<div id="result-info"></div>';
    document.querySelector('.response_info').appendChild(info);
  };

  var $playerCharacter = (function () {
    return {
      'init': function (data) {
        var pc_list = [];
        for (var i=0; i<data.length; i++) {
          var item = data[i];

          var splitStr = item.innerText.split('[基礎數值]');
          var subStr1 = new RegExp('\n','ig');
          var subStr2 = new RegExp(' ','ig');
          var pc = splitStr[0].replace('[角色基本資料]','').replace(subStr1,'').replace(subStr2,'').split('/');
          var name = pc[0].split('．');

          var base_info = {'HP':0,'MP':0,'SAN':0,'LUK':0,'STR':0,'CON':0,'SIZ':0,'DEX':0,'APP':0,'INT':0,'POW':0,'EDU':0};
          splitStr[1].replace(subStr1,'').replace(subStr2,'').split('|').forEach(function(value) {
            var val = value.split('：');
            base_info[val[0]] = val[1];
          });

          var image = '';
          item.children.forEach(function(el) {
            if (el.firstChild != null && typeof el.firstChild.currentSrc != 'undefined') {
              image = el.firstChild.currentSrc;
            }
          });

          pc_list.push({
            'name': pc[0],
            'short_name': name[name.length - 1],
            'job': pc[1],
            'base_info': base_info,
            'image': image
          });
        }
        console.log(pc_list);
        return pc_list;
      }
    };
  })();

  var $getResponse = function () {
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
      var participant;
      var pc = [];
      var list = document.querySelectorAll('.text_holder');
      list.forEach(function(item, index) {
        content[index] = item;
        if (item.innerText.includes('[參加者]')) {
          participant = item;
        }
        if (item.innerText.includes('[角色基本資料]')) {
          pc.push(item);
        }
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

      $createStyle();
      $playerCharacter.init(pc);
    });
  }
})();
