javascript:(function(){
  $('.load-all-older').click(); //載入所有回應
  var loading_flag = true;
  var result = [];
  do {
    if ($('.load-older-holder').is(':hidden') && $('#result_info').length == 0) {
      loading_flag = false;
      setTimeout(function(){
        //所有回應內容
        var content = [];
        var player_character = [];
        var arr = document.querySelectorAll('.text_holder');
        arr.forEach(function(item, index) {
          content[index] = item;
          //取得PC
          if (item.innerText.includes('[角色基本資料]')) {
            player_character.push(item);
          }
        });
        //回應者
        var arr = document.querySelectorAll('.name');
        arr.forEach(function(item, index) {
          var text = item.innerText;
          if (typeof result[text] == 'undefined') {
            result[text] = {
              'name': text,
              'count': 0,
              'content': []
            };
          }
          result[text]['count']++;
          result[text]['content'][result[text]['count'] - 1] = content[index];
        });
        $('.response_info').append('<div id="result_info" style="padding: 5px; margin: 5px;"></div>');
        result = Object.values(result).sort(function (a, b) {
          return a.count > b.count ? 1 : -1;
        }).reverse();
        console.log(result);
        console.log(player_character);
        //處理PC
        var pc_list = [];
        for(var i=0; i<player_character.length; i++) {
          var item = player_character[i];
          var temp = item.innerText.split('[基礎數值]');
          var subStr1 = new RegExp('\n','ig');
          var subStr2 = new RegExp(' ','ig');
          var pc = temp[0].replace('[角色基本資料]','').replace(subStr1,'').replace(subStr2,'').split('/');
          var base_value = [];
          temp[1].replace(subStr1,'').replace(subStr2,'').split('|').forEach(function(value) {
            var val = value.split('：');
            base_value.push(val);
          });
          var image = '';
          item.children.forEach(function(el) {
            if (el.firstChild != null && typeof el.firstChild.currentSrc != 'undefined') {
              image = el.firstChild.currentSrc;
            }
          });
          pc_list.push({
            'name': pc[0],
            'job': pc[1],
            'base_value': base_value,
            'image': image
          });
        }
        console.log(pc_list);
      },5000);
    }
    if ($('#result_info').length > 0) {
      loading_flag = false;
    }
  } while (loading_flag);
})();
