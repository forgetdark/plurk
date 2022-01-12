javascript:(function(){
  $('.load-all-older').click();
  var flag = true;
  var result = [];
  var all_result;
  do {
    if ($('.load-older-holder').is(':hidden') && $('#result_info').length == 0) {
      flag = false;
      setTimeout(function(){
        var content = [];
        var arr = document.querySelectorAll('.text_holder');
        arr.forEach(function(item, index) {
          content[index] = item.innerText;
        });
        var arr = document.querySelectorAll('.name');
        var total = 0;
        arr.forEach(function(item, index) {
          var text = item.innerText;
          if (typeof result[text] == 'undefined') {
            result[text] = {
              'name': text,
              'count': 0,
              'content': []
            };
            total++;
          }
          result[text]['count']++;
          result[text]['content'][result[text]['count'] - 1] = content[index];
        });
        $('.response_info').append('<div class="result_count" style="padding: 5px; margin: 5px;"></div>');
        $('.response_info').append('<div class="result_info"><select class="result_list" style="padding: 5px; margin: 5px;"><option value="">請選擇ID名稱</option></select><input type="search" list="search_list" name="search_key" style="padding: 5px; margin: 5px;" placeholder="請輸入ID名稱"><datalist id="search_list"></datalist><button type="button" class="search_result">搜尋</button><button type="button" class="clear_result" style="margin-left: 5px;">清除結果</button><div id="result_info" style="padding: 5px; margin: 5px;"></div></div>');
        total--;
        $('.result_count').html('<b>實際回應人數(不含噗主)：</b>'+total);
        all_result = Object.values(result).sort(function (a, b) {
          return a.count > b.count ? 1 : -1;
        }).reverse();
        var sl = document.getElementById('search_list');
        all_result.forEach(function(item, index) {
          $('.result_info select').append('<option value="'+item.name+'">'+item.name+'('+item.count+')'+'</option>');
          var op = document.createElement('option');
          op.setAttribute('value', item.name);
          op.setAttribute('label', item.name+'('+item.count+')');
          sl.appendChild(op);
        });
        console.log('載入完成');
        window.document.documentElement.scrollTop = 0;
        var rl = document.querySelector('.result_list');
        rl.addEventListener('change', function (e) {
          $('input[name=search_key]').val(e.target.value);
          $('.search_result').click();
        });
        var search_btn = document.querySelector('.search_result');
        search_btn.addEventListener('click', function (e) {
          var key = $('input[name=search_key]').val();
          $('.clear_result').click();
          if (key != '') {
            $('#result_info').append('<div><b>回應人：</b>'+result[key]['name']+'</div>');
            $('#result_info').append('<div><b>回應次數：</b>'+result[key]['count']+'</div>');
            $('#result_info').append('<div style="margin-bottom: 2px;"><b>回應內容：</b></div>');
            for (var i=0; i<result[key]['content'].length; i++) {
              var bg = '';
              if (i%2==0) {
                bg = '#EEE;';
              } else {
                bg = '#FFF;';
              }
              var subStr = new RegExp('\n','ig');
              var str = result[key]['content'][i];
              $('#result_info').append('<div style="padding: 5px; background:'+bg+'">'+str.replace(subStr, '<br>')+'</div>');
            }
          }
        });
        var clear_btn = document.querySelector('.clear_result');
        clear_btn.addEventListener('click', function (e) {
          $('#result_info').html('');
          $('input[name=search_key]').val('');
        });
      },5000);
    }
    if ($('#result_info').length > 0) {
      flag = false;
    }
  } while (flag);
})();
