/**
  只是提供三级联动的思路 页面自己随便写的  
**/
(function(){
    var height = 40;  // 也可以自己手动去获取 
    var oneDom = document.querySelector('.one');
    var twoDom = document.querySelector('.two');
    var threeDom = document.querySelector('.three');

    var iOneDomSetVal = document.querySelector('#iOneId');
    var iTwoDomSetVal = document.querySelector('#iTwoId');
    var iThreeDomSetVal = document.querySelector('#iThreeId');

    var oneList = [];
    var twoList = [];
    var threeList = [];

    // 上面添加两个 下面添加两个空白dom 用于可以选中第一个和最后一个
    function addEmptyDom(dom){
      for(var i = 0; i<2; i++){
        var emptyDom =document.createElement('div');
        var emptyDomT =document.createElement('div');
        var one = dom.children[0];
        dom.insertBefore(emptyDomT,one);
        dom.appendChild(emptyDom);
      }
    };
    // 先在页面中添加一些数据吧
    function addDom(dom, dataList, list){
      var fragment = document.createDocumentFragment();
       for(var i = 0, length = dataList.length; i<length; i++){
          for(var j = 1; j<=5; j++){
            var div = document.createElement('div');
            var ij = dataList[i]+''+j
            div.innerText = ij;
            list.push(ij);
            fragment.appendChild(div);
          }
       }
       addEmptyDom(fragment);
       dom.appendChild(fragment);
    };

    
    // 其实这里模拟数据可以写一个递归的, 但是我写不出来
    // 有大神写出来的 可以交流一下
    addDom(oneDom, [0], oneList);
    addDom(twoDom, oneList, twoList);
    addDom(threeDom, twoList, threeList);

    iOneDomSetVal.innerText = oneList[0];
    iTwoDomSetVal.innerText = twoList[0];
    iThreeDomSetVal.innerText = threeList[0];

    function trundle(dom, h){
      dom.scrollTop = h;
    };
    // 计算高度
    function scrollHeight(dom, h, fun, showDomVal){
      var heValue = parseInt(h/height);   //选中的值
      var remnant = (h-heValue*height)/height;
      heValue = remnant === 0 ? heValue : remnant > 0.5 ? heValue++ : heValue--;
      // 当没有完全滚动在选中的位置
      trundle(dom, heValue * height);
      // 拿到选中的值
      showDomVal.dom.innerText = showDomVal.list[heValue];
      fun && fun(heValue);
      return;
    };

    // 判断滚动条是否停止
    function domScroll(dom, fun, showDomVal){
        var h = dom.scrollTop;
        // 500毫秒后拿一次值, 如果相等 则认为滚动条停止了
        setTimeout(function(){
          if(dom.scrollTop === h){
            scrollHeight(dom, h, fun, showDomVal);
          }
        }, 500);
    };

    // 数据初始化完成
    oneDom.addEventListener('scroll', function(e){
      domScroll(oneDom, function(arg){
          var twoValue = arg * 5;
          twoDom.scrollTop = twoValue * 40;
          iTwoDomSetVal.innerText = twoList[twoValue];
          (function(){
            var threeValue = twoValue * 5;
              threeDom.scrollTop = threeValue * 40;
              iThreeDomSetVal.innerText = threeList[threeValue];
          })();
          return;
      }, {list: oneList,dom: iOneDomSetVal});
    });

    twoDom.addEventListener('scroll', function(e){
      domScroll(twoDom, function(arg){
          var threeValue = arg * 5;
          threeDom.scrollTop = threeValue * 40;
          iThreeDomSetVal.innerText = threeList[threeValue];
          return;
      }, {list: twoList,dom: iTwoDomSetVal});
    });

    threeDom.addEventListener('scroll', function(e){
      domScroll(threeDom, '',{list: threeList,dom: iThreeDomSetVal});
    }, false);
})();