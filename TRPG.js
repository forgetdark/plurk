javascript:(function(){
  $('.load-all-older').click();
  var loading_flag = true;
  var result = [];
  do {
    if ($('.load-older-holder').is(':hidden') && $('#result_info').length == 0) {
      loading_flag = false;
      setTimeout(function(){
        var content = [];
        var participant;
        var player_character = [];
        var arr = document.querySelectorAll('.text_holder');
        arr.forEach(function(item, index) {
          content[index] = item;
          if (item.innerText.includes('[參加者]')) {
            participant = item;
          }
          if (item.innerText.includes('[角色基本資料]')) {
            player_character.push(item);
          }
        });
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
        var kp_list = [];
        var pl_list = [];
        var splitStr = console.log(participant.innerText.split('\n'));

        var pc_list = [];
        for(var i=0; i<player_character.length; i++) {
          var item = player_character[i];
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
      },5000);
    }
    if ($('#result_info').length > 0) {
      loading_flag = false;
    }
  } while (loading_flag);
})();
